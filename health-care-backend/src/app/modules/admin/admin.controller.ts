import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdminService } from './admin.service';
import { adminFilterableFields } from './admin.constant';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import pick from '../../helper/pick';



const getAllAdminsFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await AdminService.getAllAdminsFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched!",
        meta: result.meta,
        data: result.data
    })
})

const getAdminByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.getAdminByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched by id!",
        data: result
    });
})


const updateAdminIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.updateAdminIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data updated!",
        data: result
    })
})

const deleteAdminFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.deleteAdminFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
})


const softAdminDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.softDeleteAdminFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
});

export const AdminController = {
    getAllAdminsFromDB,
    getAdminByIdFromDB,
    updateAdminIntoDB,
    deleteAdminFromDB,
    softAdminDeleteFromDB
}