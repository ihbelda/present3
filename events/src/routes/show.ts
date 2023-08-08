import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@anei/common';
import { Event } from '../models/event';

const router = express.Router();

router.get(
  '/api/events/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError();
    }

    res.send(event);
  }
);

export { router as showEventRouter };
