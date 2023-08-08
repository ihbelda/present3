import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@anei/common';
import { Event } from '../models/event';
import { EventStatus } from '@anei/common/build/events/types/event-status';
//import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
//import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// A) Add as a K8s ENV VAR to be able to change it without redeploying
// B) Create a field in the DB (even per user) to setup the expiration
//const EXPIRATON_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/events',
  requireAuth,
  [
    // Validation of params
    body('title').not().isEmpty().withMessage('Title is required'),
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0'),
    body('endDate')
      .not()
      .isEmpty()
      .withMessage('End date is required')
      .isISO8601()
      .withMessage('End date format is incorrect'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, amount, endDate } = req.body;
    console.log("REQ: ", req.body);
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
    // Build the order and save it to the database
    const event = Event.build({
      title,
      amount,
      pendingAmount: amount,
      endDate,
      ownerId: req.currentUser!.id,
      // members: [{}], How to create an empty list of member?
      status: EventStatus.Created, //OrderStatus.Created,
    });
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

export { router as newEventRouter };
