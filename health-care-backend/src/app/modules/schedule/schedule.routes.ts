import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post('/',
    ScheduleController.insertScheduleIntoDB
)

export const ScheduleRoutes = router;