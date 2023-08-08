import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@anei/common';
import { Event } from '../models/event';
//import { TickerUpdatedPublisher } from '../events/publishers/ticket-updated-publishers';
//import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/events/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('endDate').not().isEmpty().withMessage('End Date is required'),
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //const { title } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError();
    }

    if (event.ownerId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    let newPendingAmount = event.amount;

    event.members!.map((member) => {
      newPendingAmount = newPendingAmount - member.amount;
    });

    event.set({
      title: req.body.title,
      amount: req.body.amount,
      pendingAmount: newPendingAmount,
      endDate: req.body.endDate,
    });

    await event.save();
    /*
    new TickerUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
*/
    res.status(200).send(event);
  }
);

export { router as updateEventRouter };
