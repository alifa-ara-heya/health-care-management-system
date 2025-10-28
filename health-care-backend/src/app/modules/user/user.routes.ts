import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";

const router = express.Router()

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
router.post('/create-admin', fileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction) => {

    const parsedData = JSON.parse(req.body.data)
    req.body = UserValidation.createAdminValidationSchema.parse(parsedData)
    return UserController.createAdmin(req, res, next)
})

// create doctor

router.post('/create-doctor', fileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    const parsedData = JSON.parse(req.body.data)

    req.body = UserValidation.createDoctorValidationSchema.parse(parsedData)
    return UserController.createDoctor(req, res, next)
})



export const userRoutes = router;