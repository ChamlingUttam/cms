import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { prisma } from '../lib/prisma';

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const authorization = req.get('authorization');
  const [scheme, token, extra] = authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token || extra) {
    res
      .status(401)
      .json({ success: false, message: 'Authentication required.' });
    return;
  }

  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid or expired token.' });
      return;
    }
    next(error);
    return;
  }

  if (
    typeof decoded === 'string' ||
    typeof decoded.sub !== 'string' ||
    typeof decoded.username !== 'string' ||
    !Number.isInteger(decoded.ver)
  ) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
    return;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: decoded.sub },
    select: { id: true, username: true, authVersion: true },
  });

  if (!admin || admin.authVersion !== decoded.ver) {
    res.status(401).json({
      success: false,
      message: 'Token is no longer valid. Please log in again.',
    });
    return;
  }

  req.admin = { id: admin.id, username: admin.username };
  next();
};
