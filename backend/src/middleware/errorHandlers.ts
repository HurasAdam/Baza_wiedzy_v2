import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "@/constants/http";
import AppError from "@/utils/AppError";
import { clearAuthCookies } from "@/utils/cookies";

const handleZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
    }));

    return res.status(BAD_REQUEST).json({
        errors,
        message: error.message,
    });
};

const handleAppError = (res: Response, error: AppError) => {
    return res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
    });
};

const errorHandler: ErrorRequestHandler = async (error: Error, req, res, next) => {
    console.log("-----");
    console.log("Error:", error.stack);

    if (req.path === "REFRESH_PATH") {
        clearAuthCookies(res);
    }

    if (error instanceof z.ZodError) {
        return handleZodError(res, error);
    }

    if (error instanceof AppError) {
        return handleAppError(res, error);
    }
    return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;
