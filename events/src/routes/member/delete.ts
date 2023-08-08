import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@anei/common';
import { Event } from '../../models/event';
//import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
//import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/events/:eventId/members/:memberId/delete',
  requireAuth,
  async (req: Request, res: Response) => {
    const { eventId, memberId } = req.params;
    const event = await Event.findById(eventId); //.populate('ticket');

    if (!event) {
      throw new NotFoundError();
    }
    if (event.ownerId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const memberIndex = event.members!.findIndex((item) => {
      return item.id === memberId;
    });

    if (memberIndex < 0) {
      throw new NotFoundError();
    }

    event.members!.splice(memberIndex, 1);
    event.set({
      members: event.members!,
    });

    await event.save();

    // Publish a Cancelled order event
    // new OrderCancelledPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   version: order.version,
    //   ticket: {
    //     id: order.ticket.id,
    //   },
    // });

    res.status(204).send(event);
  }
);

export { router as deleteMemberRouter };
