import { NextFunction, Request, Response } from "express"
import { jwtHelper } from "../helper/jwtHelper";
import config from "../../config";

export const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.accessToken;

            if (!token) {
                throw new Error("You don't have tokens. You are not authorized!")
            }

            const accessSecret = config.jwt.access_secret
            if (!accessSecret) {
                throw new Error("JWT access secret is not configured.")
            }

            const verifyUser = jwtHelper.verifyToken(token, accessSecret)

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new Error('You are not authorized.')
            }

            next()


        } catch (error) {
            next(error)
        }
    }
}