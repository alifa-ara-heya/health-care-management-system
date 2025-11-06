import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";

import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema),
    DoctorScheduleController.insertIntoDB
)

export const doctorScheduleRoutes = router;