import express, { Request, Response } from 'express';
import { Event } from '../models/event';
import { requireAuth } from '@anei/common';

const router = express.Router();

router.get('/api/events', 
requireAuth,
  async (req: Request, res: Response) => {
  const events = await Event.find({
    ownerId: req.currentUser!.id
  });

  res.send(events);
});

export { router as indexEventRouter };
