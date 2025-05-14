import 'reflect-metadata';
import express, {Application, NextFunction, Request, Response} from 'express';
import {useExpressServer} from "routing-controllers";
import dotenv from 'dotenv';
import * as mongoose from "mongoose";
import FarmerController from "./farmerAcc/controllers/FarmerController";
import ClientController  from "./clientAcc/controllers/ClientController";
//import {AuthorizationMiddleware} from "./farmerAkk/Middleware/AuthorizationMiddleware";
//import expressAsyncHandler from "express-async-handler";
//import {ForbiddenError, HttpError, NotFoundError} from "routing-controllers";
import { ErrorHandlerMiddleware } from "./farmerAcc/Middleware/ErrorHandlerMiddleware";


dotenv.config();

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) =>{
        console.error('MongoDb connection error: ' + err);
        process.exit(1);
     })

const app: Application = express();
const PORT = 8080;

app.use(express.json());

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.message);
//     res.status(400).json({error: err.message});
// })

useExpressServer(app, {
    controllers: [FarmerController, ClientController],
    middlewares: [ErrorHandlerMiddleware],
    defaultErrorHandler: false,
});

async function startServer() {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    })
}

startServer().catch(console.error);