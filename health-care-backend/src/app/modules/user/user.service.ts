import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcryptjs";

/**
 * Creates a new patient with associated user account
 * @param payload - Patient registration data including email, password, and name
 * @returns Promise<Patient> - The created patient record
 */
const createPatient = async (payload: createPatientInput) => {
    // Hash the patient's password using bcrypt with salt rounds of 10
    // TODO: Move salt rounds to environment variable for better security
    const hashPassword = await bcrypt.hash(payload.password, 10)

    // Use database transaction to ensure data consistency
    // Both user and patient records must be created together or not at all
    const result = await prisma.$transaction(async (tnx) => {
        // First, create the user account in the users table
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword,
            }
        })

        // Then, create the corresponding patient profile in the patients table
        // The patient record references the user via email (foreign key relationship)
        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email, // This creates the relationship with the user table
            }
        })
    })

    return result;
}

export const UserService = {
    createPatient
}