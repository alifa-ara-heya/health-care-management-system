import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    // console.log("Patient: ", req.body);
    const result = await UserService.createPatient(req.body)
    // res.send(result)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Patient Created Successfully.',
        data: result
    })

})

export const UserController = {
    createPatient
}