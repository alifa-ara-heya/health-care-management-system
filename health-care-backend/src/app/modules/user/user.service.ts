import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";

/**
 * Creates a new patient with associated user account
 * @param payload - Patient registration data including email, password, and name
 * @returns Promise<Patient> - The created patient record
 */
const createPatient = async (req: Request) => {

    // file sending is optional, so we will check if it exists
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        // console.log('uploadResult from user.service.ts', uploadResult);
        req.body.patient.profilePhoto = uploadResult?.secure_url

    }

    // Hash the patient's password using bcrypt with salt rounds of 10
    // TODO: Move salt rounds to environment variable for better security
    const hashPassword = await bcrypt.hash(req.body.password, 10)

    // Use database transaction to ensure data consistency
    // Both user and patient records must be created together or not at all
    const result = await prisma.$transaction(async (tnx) => {
        // First, create the user account in the users table
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashPassword,
            }
        })

        // Then, create the corresponding patient profile in the patients table
        // The patient record references the user via email (foreign key relationship)
        return await tnx.patient.create({
            data: req.body.patient
            // name: req.body.name,
            // email: req.body.email, // This creates the relationship with the user table


        })
    })

    return result;
}

export const UserService = {
    createPatient
}