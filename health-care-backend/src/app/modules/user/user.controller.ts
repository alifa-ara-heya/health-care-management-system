import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status'

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

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Doctor Created successfully!",
        data: result
    })
})

export const UserController = {
    createPatient,
    createAdmin,
    createDoctor
}