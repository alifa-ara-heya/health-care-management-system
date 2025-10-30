import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const insertScheduleIntoDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.insertScheduleIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
})

export const ScheduleController = {
    insertScheduleIntoDB
}