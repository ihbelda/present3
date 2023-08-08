import express, { Request, Response } from 'express';
import { Mail } from '../services/mail';

import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@anei/common';
import { Event } from '../models/event';
import { EventStatus, MemberStatus } from '@anei/common/build/events/types/event-status';
//import { TickerUpdatedPublisher } from '../events/publishers/ticket-updated-publishers';
//import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/events/:id/close',
  requireAuth,
  async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError();
    }

    if (event.ownerId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Init Mailer
    const mail = Mail.init();

    // Notify Members & status to Notified
    event.members!.forEach((member) => {
      if (member.status == MemberStatus.Payed) {
        const msg = `The Event ${event.title} has been closed. Thanks for participating with ${member.amount}`;
        Mail.sendMessage(mail, member.email!, msg);
      }
    });

    // Update Event
    event.set({
      status: EventStatus.Closed,
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

export { router as closeEventRouter };
