import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  validateRequest,
  BadRequestError,
} from '@anei/common';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('username')
      .isLength({ min: 4, max: 15 })
      .withMessage('Username must be between 4 and 10 characters'),
    body('password')
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      throw new BadRequestError('Email in use');
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new BadRequestError('Username in use');
    }

    const user = User.build({ username, password, email, role: 'user' });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      },
      process.env.JWT_KEY!
    );

    // Store it in on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
