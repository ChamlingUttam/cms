import type { RequestHandler } from 'express';
import {
  AdminUsernameConflictError,
  changeAdminCredentials,
  logoutAdmin as revokeAdminSessions,
  verifyAdminCredentials,
} from './service';

export const loginAdmin: RequestHandler = async (req, res) => {
  const { username, password } = req.body ?? {};

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.trim().length === 0 ||
    username.trim().length > 64 ||
    password.length === 0
  ) {
    res.status(400).json({
      success: false,
      message: 'A valid username and password are required.',
    });
    return;
  }

  const admin = await verifyAdminCredentials(username, password);

  if (!admin) {
    res.status(401).json({
      success: false,
      message: 'Invalid username or password.',
    });
    return;
  }

  res.json({ success: true, data: admin });
};

export const changeAdminFields: RequestHandler = async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body ?? {};
  const hasUsername = newUsername !== undefined;
  const hasPassword = newPassword !== undefined;

  if (
    typeof currentPassword !== 'string' ||
    currentPassword.length === 0 ||
    (!hasUsername && !hasPassword) ||
    (hasUsername &&
      (typeof newUsername !== 'string' ||
        newUsername.trim().length === 0 ||
        newUsername.trim().length > 64)) ||
    (hasPassword &&
      (typeof newPassword !== 'string' || newPassword.length < 8))
  ) {
    res.status(400).json({
      success: false,
      message:
        'Provide your current password and a new username and/or a password of at least 12 characters.',
    });
    return;
  }

  const adminId = req.admin?.id;

  if (!adminId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
    return;
  }

  try {
    const result = await changeAdminCredentials(adminId, {
      currentPassword,
      newUsername,
      newPassword,
    });

    if (!result) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Admin credentials updated.',
      data: result,
    });
  } catch (error) {
    if (error instanceof AdminUsernameConflictError) {
      res.status(409).json({
        success: false,
        message: 'That username is already in use.',
      });
      return;
    }

    throw error;
  }
};

export const getCurrentAdmin: RequestHandler = (req, res) => {
  res.json({ success: true, data: { admin: req.admin } });
};

export const logoutAdmin: RequestHandler = async (req, res) => {
  const adminId = req.admin?.id;

  if (!adminId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
    return;
  }

  await revokeAdminSessions(adminId);

  res.json({
    success: true,
    message: 'Admin signed out.',
  });
};
