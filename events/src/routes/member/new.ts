import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@anei/common';
import { Member, } from '../../models/member';
import { Event } from '../../models/event';
import { isNamedTupleMember } from 'typescript';
import { MemberStatus } from '@anei/common/build/events/types/event-status';
//import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
//import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
// A) Add as a K8s ENV VAR to be able to change it without redeploying
// B) Create a field in the DB (even per user) to setup the expiration
//const EXPIRATON_WINDOW_SECONDS = 1 * 60;

  // userId: string;
  // status: string;
  // amount: number;

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
    /*
    // Find the ownerId for the user is trying to order in the database
    const user = await User.findById(ownerId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure the ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and*  the order status is *not* cancelled.
    // If we find an order from that means the ticket *is* reserved

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expriration date for this order
    const expiration = new Date(); // created with now time
    expiration.setSeconds(expiration.getSeconds() + EXPIRATON_WINDOW_SECONDS);
*/
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
      userId: new mongoose.Types.ObjectId().toString(), // TODO add the user in Users service
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
    /*
    // Publish event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(), // Deal with TZ -> use UTC to be agnostic
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
*/
    res.status(201).send(event);
  }
);

export { router as newEventMemberRouter };
