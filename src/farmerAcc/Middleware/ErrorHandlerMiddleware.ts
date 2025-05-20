// import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
// import { Request, Response, NextFunction } from "express";

// @Middleware({ type: "after" })
// export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
//     error(error: any, req: Request, res: Response, next: NextFunction) {
//         console.error("Error:", error.message);
//         res.status(error.httpCode || 500).json({ error: error.message });
//     }
// }

import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from "routing-controllers";
import { Request, Response, NextFunction } from "express";

@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = error.httpCode || error.status || 500;
    const message = error.message || 'Internal Server Error';

    // Логируем для отладки
    console.error(`[ErrorHandlerMiddleware] ${statusCode}: ${message}`);

    res.status(statusCode).json({ message });
  }
}