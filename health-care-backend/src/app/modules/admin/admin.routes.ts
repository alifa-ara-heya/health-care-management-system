import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';

import { UserRole } from '@prisma/client';
import { auth } from '../../middlewares/auth';
import { adminValidationSchemas } from './admin.validation';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.ADMIN),
    AdminController.getAllAdminsFromDB
);

router.get(
    '/:id',
    auth(UserRole.ADMIN),
    AdminController.getAdminByIdFromDB
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN),
    validateRequest(adminValidationSchemas.update),
    AdminController.updateAdminIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    AdminController.deleteAdminFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN),
    AdminController.softAdminDeleteFromDB
);

export const AdminRoutes = router;