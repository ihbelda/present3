import express, { Request, Response } from 'express';
import { Mail } from '../services/mail'

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
  '/api/events/:id/launch',
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
    let membersSum = 0;

    // Notify Members & status to Notified
    event.members!.forEach(function (member) {
      membersSum = membersSum + member.amount;
      
      if (member.status == MemberStatus.Created) {
        const msg = `Press this <a href='https://present3.us/events/${event.id}/members/${member.id}'>link</a> to sign up in the event ${event.title}`;
        member.status = MemberStatus.Notified;
        Mail.sendMessage(mail, member.email!, msg);
      }
    });

    // Update Event
    event.set({
      status: EventStatus.Launched,
      pendingAmount: event.amount - membersSum,
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

export { router as launchEventRouter };
