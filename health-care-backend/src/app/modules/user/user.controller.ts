import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    // console.log("Patient: ", req.body);
    const result = await UserService.createPatient(req)
    console.log("request form user controller", req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Patient Created Successfully.',
        data: result
        // data: ''
    })

})

export const UserController = {
    createPatient
}