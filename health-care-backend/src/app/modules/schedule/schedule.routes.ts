import express from "express";
import { ScheduleController } from "./schedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get('/',
    auth(UserRole.DOCTOR, UserRole.ADMIN),
    ScheduleController.allSchedulesForADoctor
)

router.post('/',
    auth(UserRole.ADMIN),
    ScheduleController.insertScheduleIntoDB
)

router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    ScheduleController.deleteScheduleFromDB
)

export const ScheduleRoutes = router;