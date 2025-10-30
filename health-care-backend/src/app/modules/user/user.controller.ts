import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status'
import pick from "../../helper/pick";


// create patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
    // console.log("Patient: ", req.body);
    const result = await UserService.createPatient(req)
    // console.log("request form user controller", req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Patient Created Successfully.',
        data: result
        // data: ''
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createAdmin(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Admin created successfully',
        data: result
    })
})

// creating doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Doctor Created successfully!",
        data: result
    })
})


// getting all users from DB
const getAllUsersFromDB = catchAsync(async (req: Request, res: Response) => {
    // page, limit, sortBy, sortOrder - pagination, sorting
    // fields, searchTerm - searching, filtering
    const filters = pick(req.query, ["status", "role", "email"])

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])


    // const { limit, page, searchTerm, sortBy, sortOrder, role, status } = req.query;
    // console.log({ limit, page });
    // const result = await UserService.getAllUsersFromDB({ limit: Number(limit), page: Number(page), searchTerm, sortBy, sortOrder, role, status });
    const result = await UserService.getAllUsersFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All users retrieved successfully!",
        data: result
    })
})


export const UserController = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllUsersFromDB
}