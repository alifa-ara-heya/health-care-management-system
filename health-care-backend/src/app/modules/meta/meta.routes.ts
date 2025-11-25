import express from 'express';
import { MetaController } from './meta.controller';
import { UserRole } from '@prisma/client';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    MetaController.fetchDashboardMetaData
)


export const MetaRoutes = router;