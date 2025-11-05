import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";

import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB
)

export const doctorScheduleRoutes = router;