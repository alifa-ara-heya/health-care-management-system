import express from "express";
import { DoctorController } from "./doctor.controller";
const router = express.Router();

router.get(
    "/",
    DoctorController.getAllDoctorsFromDB
)

router.patch(
    "/:id",
    DoctorController.updateDoctorIntoDB
)
export const DoctorRoutes = router;