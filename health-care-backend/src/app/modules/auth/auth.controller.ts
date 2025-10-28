import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
    // console.log("Patient: ", req.body);
    const result = await AuthService.login(req.body)
    const { accessToken, refreshToken, needPasswordChange } = result;

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60
    })
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
    })


    // console.log("result from auth controller", result);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User logged in Successfully.',
        data: {
            needPasswordChange
        }
        // data: ''
    })

})

export const AuthController = {
    login
}