import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router()

// get all users
router.get('/',
    auth(UserRole.ADMIN),
    UserController.getAllUsersFromDB)

router.get(
    '/me',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    UserController.getMyProfile
)

// create patient
router.post('/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {

        // Parse the JSON data from form-data
        const parsedData = JSON.parse(req.body.data)
        // Validate the parsed data
        req.body = UserValidation.createPatientValidationSchema.parse(parsedData)
        return UserController.createPatient(req, res, next)

    })

// create admin
router.post('/create-admin',
    auth(UserRole.ADMIN),
    fileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction) => {

        const parsedData = JSON.parse(req.body.data)
        req.body = UserValidation.createAdminValidationSchema.parse(parsedData)
        return UserController.createAdmin(req, res, next)
    })

// create doctor
router.post('/create-doctor',
    auth(UserRole.ADMIN), fileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
        const parsedData = JSON.parse(req.body.data)

        req.body = UserValidation.createDoctorValidationSchema.parse(parsedData)
        return UserController.createDoctor(req, res, next)
    })


router.patch(
    '/:id/status',
    auth(UserRole.ADMIN),
    UserController.changeProfileStatus
);

export const userRoutes = router;