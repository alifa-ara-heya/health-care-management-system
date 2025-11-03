import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../helper/pick";
import { IJWTPayload } from "../../../types/common";

const insertScheduleIntoDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.insertScheduleIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
})

const allSchedulesForADoctor = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    // pagination
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    const filters = pick(req.query, ['startDateTime', 'endDateTime'])
    const user = req.user;


    const result = await ScheduleService.allSchedulesForADoctor(filters, options, user as IJWTPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Schedules are retrieved successfully!",
        data: result
    })
})

// deleting schedule
const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.deleteScheduleFromDB(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully!",
        data: result
    })
})

export const ScheduleController = {
    insertScheduleIntoDB,
    allSchedulesForADoctor,
    deleteScheduleFromDB
}