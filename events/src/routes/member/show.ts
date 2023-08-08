import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@anei/common';
import { Event } from '../../models/event';
import { Member } from '../../models/member';

const router = express.Router();

router.get(
  '/api/events/:eventId/members/:memberId',
  //requireAuth, TODO: see how to protect while alowing invited to do it
  async (req: Request, res: Response) => {
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

    res.send(event.members![memberIndex]);
  }
);

export { router as showMemberRouter };
