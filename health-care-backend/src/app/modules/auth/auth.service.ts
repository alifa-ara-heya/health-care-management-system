import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { jwtHelper } from "../../helper/jwtHelper"
import config from "../../../config"
import ApiError from "../../errors/ApiError"
import httpStatus from "http-status"

const login = async (payload: { email: string, password: string }) => {
    // if (!config.jwt.access_secret || !config.jwt.refresh_secret || !config.jwt.access_expires || !config.jwt.refresh_expires) {
    //     throw new Error('JWT configuration is incomplete.');
    // }
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isPasswordCorrect = await bcrypt.compare(payload.password, user.password)
    if (!isPasswordCorrect) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect.')
    }

    const accessToken = jwtHelper.generateToken({
        email: user.email,
        role: user.role
    }, config.jwt.access_secret!, config.jwt.access_expires!)

    const refreshToken = jwtHelper.generateToken({
        email: user.email,
        role: user.role
    }, config.jwt.refresh_secret!, config.jwt.refresh_expires!)

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }
}

export const AuthService = {
    login
}