import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@anei/common';
import { stripe } from '../../stripe';
import { Event } from '../../models/event';
import { MemberStatus } from '@anei/common/build/events/types/event-status';

const router = express.Router();

router.post(
  '/api/events/:eventId/members/:memberId/subscribe',
  async (req: Request, res: Response) => {
    const { token } = req.body;
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      throw new NotFoundError();
    }
    // TODO need to cover authorized and not authorized (external link to accept invite) requests
    // if (event.ownerId !== req.currentUser!.id) {
    //   throw new NotAuthorizedError();
    // }

    const memberIndex = event.members!.findIndex((item) => {
      return item.id === req.params.memberId;
    });

    if (memberIndex < 0) {
      throw new NotFoundError();
    }
    event.members![memberIndex].status = MemberStatus.Accepted;

    // Do the payment
    const charge = await stripe.charges.create({
      currency: 'eur',
      amount: event.members![memberIndex].amount * 100,
      source: token,
    });

    if (charge.paid) {
      event.members![memberIndex].status = MemberStatus.Payed;
      event.members![memberIndex].stripeId = charge.id;
    } else {
      throw new BadRequestError("The payment with Stripe was rejected");
    }

    event.set({
      members: event.members!,
    });

    await event.save();

    console.log('Payed?: ', charge.paid);

    res.send(event.members![memberIndex]);
  }
);

export { router as subscribeMemberRouter };
