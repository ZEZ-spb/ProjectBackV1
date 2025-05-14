import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
import { Request, Response, NextFunction } from "express";

@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, req: Request, res: Response, next: NextFunction) {
        console.error("Error:", error.message);
        res.status(error.httpCode || 500).json({ error: error.message });
    }
}