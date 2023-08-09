import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@anei/common';
import { Member, } from '../../models/member';
import { Event } from '../../models/event';
import { MemberStatus } from '@anei/common/build/events/types/event-status';
import { MemberCreatedPublisher } from '../../events/publishers/member-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  '/api/events/:id/members',
  requireAuth,
  [
    // Validation of params
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { amount, username, email } = req.body;

    // Look for the Event
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError();
    }

    if (event.ownerId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const member = Member.build({
      username: username,
      userId: new mongoose.Types.ObjectId().toString(), // TODO: add the user in Users service
      status: MemberStatus.Created,
      amount: amount,
      email: email
    });

    let newPendingAmount = event.amount;

    if (event.members) {
      event.members!.map((member) => {
        newPendingAmount = newPendingAmount - member.amount;
      });
      event.members.push(member);
      event.set({
        members: event.members!,
        pendingAmount: newPendingAmount
      });
    } else {
      event.set({
        members: [member],
        pendingAmount: newPendingAmount,
      });
    }

    await event.save();
    // Publish event saying that an order was created
    new MemberCreatedPublisher(natsWrapper.client).publish({
      username: member.username,
      email: member.email!,
      version: event.version, // TODO: double-check if using event version is ok
    });
    res.status(201).send(event);
  }
);

export { router as newEventMemberRouter };
