import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import config from "../../../config";
import { Admin, Doctor, Prisma, UserRole } from "@prisma/client";
import { calculatePagination } from "../../helper/paginationHelper";
import { userSearchableFields } from "./user.constant";

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
    const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round))

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

// creating admin
const createAdmin = async (req: Request): Promise<Admin> => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)

        req.body.admin.profilePhoto = uploadResult?.secure_url
    }

    const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round))

    const userData = {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: userData
        })

        const createdAdminData = await tnx.admin.create({
            data: req.body.admin
        })

        return createdAdminData;
    });

    return result;
}

// creating doctor
const createDoctor = async (req: Request): Promise<Doctor> => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)

        req.body.doctor.profilePhoto = uploadResult?.secure_url
    }

    const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round))

    const userData = {
        email: req.body.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: userData
        })

        const createdDoctorData = await tnx.doctor.create({
            data: req.body.doctor
        })

        return createdDoctorData;
    });

    return result;

}


// const getAllUsersFromDB = async ({ limit, page, searchTerm, sortBy, sortOrder, role, status }: { limit: number, page: number, searchTerm?: any, sortBy: any, sortOrder: any, role: any, status: any }) => {


//     // pagination
//     const pageNumber = page || 1;
//     const limitNumber = limit || 10;
//     const skip = (pageNumber - 1) * limitNumber;
//     const result = await prisma.user.findMany({
//         skip,
//         take: limitNumber,

//         // searching
//         where: {
//             email: {
//                 contains: searchTerm,
//                 mode: "insensitive" //case insensitive search
//             },
//             role: role,
//             status: status,
//         },

//         // order by
//         // orderBy: {
//         //     // createdAt: "asc"
//         //     createdAt: "desc"
//         // }
//         orderBy: sortBy && sortOrder ? {
//             [sortBy]: sortOrder
//         } : {
//             createdAt: 'asc'
//         }

//     });

//     return result
// }

/**
 * Retrieves all users from the database with advanced filtering, searching, and pagination
 * 
 * @param params - Contains search term and filter criteria (e.g., { searchTerm: "john", role: "DOCTOR", status: "ACTIVE" })
 * @param options - Contains pagination and sorting options (e.g., { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" })
 * @returns Promise with paginated user data and metadata (total count, page info)
 */
const getAllUsersFromDB = async (params: any, options: any) => {
    // STEP 1: Calculate pagination values
    // This helper function converts string/numbers to proper pagination values
    // Example: { page: "2", limit: "10" } becomes { page: 2, limit: 10, skip: 10, sortBy: "createdAt", sortOrder: "desc" }
    // 'skip' tells Prisma how many records to skip (for pagination)
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)

    // STEP 2: Separate search term from other filter criteria
    // Using destructuring: extract 'searchTerm' separately, put everything else in 'filterData'
    // Example: If params = { searchTerm: "john", role: "DOCTOR", status: "ACTIVE" }
    //          Then: searchTerm = "john", filterData = { role: "DOCTOR", status: "ACTIVE" }
    const { searchTerm, ...filterData } = params;

    // STEP 3: Build an array to hold all our search/filter conditions
    // We'll combine multiple conditions using AND logic
    // Each condition in this array will be joined with AND (all must be true)
    const andConditions: Prisma.UserWhereInput[] = [];

    // STEP 4: Add search condition (if searchTerm exists)
    // Search uses OR logic across multiple fields - user matches if ANY field contains the search term
    // Example: If searchTerm = "john", it searches in email, name, etc. (userSearchableFields)
    //          This creates: OR: [ { email: { contains: "john" } }, { name: { contains: "john" } } ]
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,  // Partial match (not exact)
                    mode: "insensitive"     // Case-insensitive (matches "John", "JOHN", "john")
                }
            }))
        })
    }

    // STEP 5: Add filter conditions (if any filter data exists)
    // Filters use AND logic - user must match ALL specified filter criteria exactly
    // Example: If filterData = { role: "DOCTOR", status: "ACTIVE" }
    //          This creates: AND: [ { role: { equals: "DOCTOR" } }, { status: { equals: "ACTIVE" } } ]
    //          Meaning: user must be a DOCTOR AND have status ACTIVE
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]  // Exact match (not partial)
                }
            }))
        })
    }

    // STEP 6: Combine all conditions into final WHERE clause
    // If we have any conditions, wrap them in an AND clause
    // If no conditions, return empty object (meaning: get all users, no filtering)
    // Final structure: { AND: [ { OR: [...] }, { AND: [...] } ] }
    //                  Which means: (Search matches OR) AND (All filters match AND)
    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    // STEP 7: Execute the database query
    // findMany retrieves multiple records based on our conditions
    // - skip: How many records to skip (for pagination - e.g., skip 10 to get page 2)
    // - take: How many records to return (page size - e.g., limit of 10)
    // - where: Our search/filter conditions
    // - orderBy: Sort the results (e.g., newest first: { createdAt: "desc" })
    const result = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder  // Dynamic sorting: [sortBy] becomes the field name (e.g., "createdAt")
        }
    });

    // STEP 8: Count total matching records (needed for pagination metadata)
    // This tells us the total number of users matching our search/filter
    // (not just the ones on the current page)
    const total = await prisma.user.count({
        where: whereConditions
    });

    // STEP 9: Return formatted response with data and metadata
    // meta: Information about pagination (current page, items per page, total count)
    // data: The actual user records for the current page
    return {
        meta: {
            page,      // Current page number
            limit,     // Items per page
            total      // Total number of matching records (across all pages)
        },
        data: result   // The users on the current page
    };

}

export const UserService = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllUsersFromDB
}