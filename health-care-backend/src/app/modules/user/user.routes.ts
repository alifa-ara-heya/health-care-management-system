import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";

const router = express.Router()

router.post('/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the JSON data from form-data
            const parsedData = JSON.parse(req.body.data)
            // Validate the parsed data
            req.body = UserValidation.createPatientValidationSchema.parse(parsedData)
            return UserController.createPatient(req, res, next)
        } catch (error) {
            next(error)
        }
    },
)

export const userRoutes = router;