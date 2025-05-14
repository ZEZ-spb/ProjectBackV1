import {Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res, UseBefore} from "routing-controllers";
import NewFarmerDto from "../dto/NewFarmerDto";
import FarmerService from "../service/FarmerService";
import FarmerServiceImpl from "../service/FarmerServiceImpl";
import {AuthenticationMiddleware} from "../Middleware/AuthenticationMiddleware";
//import {AuthorizationMiddleware} from "../Middleware/AuthorizationMiddleware";
//import expressAsyncHandler from "express-async-handler";
//import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
//import {ForbiddenError, HttpError, NotFoundError} from "routing-controllers";
//import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
//import { NextFunction } from "express"
import NewBagDto from "../dto/NewBagDto";


// @Middleware({ type: "after" })
// export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
//     error(error: any, req: Request, res: Response, next: NextFunction) {
//         console.error("Error:", error.message);
//         res.status(error.httpCode || 500).json({ error: error.message });
//     }
// }


@Controller('/farmer')

export default class FarmerController {

     farmerService: FarmerService = new FarmerServiceImpl();


     @Post("/register")
     async register(
        @Body() newFarmerDto: NewFarmerDto
    ) {
         return this.farmerService.register(newFarmerDto);
     } 


     @Post("/login")
     async login(
        @Body() loginDto: { login: string, password: string }, 
        @Res() res: Response
    ) {
         const token =  await this.farmerService.login(loginDto.login, loginDto.password);
          return res.json({token});
     }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Put('/updatePassword')
        async updatePassword(
            @Body() body: { newPassword: string },
            @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
            @Res() res: Response         
        ) {
            if (req.body.farmer.role !== 'farmer') {
                return res.status(403).json({ message: "You are not a farmer" });
            }
            const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена        
            const newPassword = body.newPassword; // Извлекаем новый пароль из тела запроса
        
            return await this.farmerService.updatePassword(
                authenticatedUserLogin,
                newPassword
            );
        }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)   
     @UseBefore(AuthenticationMiddleware)
     @Put('/update')
     async updateFarmer(
         @Body() updateFarmerDto: NewFarmerDto,
         @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
         @Res() res: Response         
     ) {
            if (req.body.farmer.role !== 'farmer') {
                return res.status(403).json({ message: "You are not a farmer" });
            }
         const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена
     
         return await this.farmerService.updateFarmer(
             authenticatedUserLogin,
             updateFarmerDto.firstName, updateFarmerDto.lastName,
             updateFarmerDto.email, updateFarmerDto.phone,
             updateFarmerDto.address, updateFarmerDto.postalCode);
     }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
    @UseBefore(AuthenticationMiddleware)
    @Delete('/remove')
    async removeFarmer(
        @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware 
        @Res() res: Response        
    ) {
        if (req.body.farmer.role !== 'farmer') {
            return res.status(403).json({ message: "You are not a farmer" });
        }
        const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена
     
        return await this.farmerService.removeFarmer(
            authenticatedUserLogin
        );
    }


 //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Get('/getFarmerByLogin/:login')
     async getFarmerByLogin(
        @Param('login') login: string 
    ) {
         return await this.farmerService.getFarmerByLogin(login);
     }


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)     //Пока не надо, м.б. потом
     @UseBefore(AuthenticationMiddleware)
     @Get('/getAllfarmers')
     async getAllFarmers(@Res() res: Response) {
         return await this.farmerService.getAllFarmers();
     }


    //@UseBefore(AuthenticationMiddleware,AuthorizationMiddleware)  //Пока не надо, м.б. потом
    @UseBefore(AuthenticationMiddleware)
    @Get('/getFarmersByProduct/:product')   
    async getFarmersByProduct(
    @Param('product') product: string,
    @Res() res: Response
    )  {
    if (!product ) {
        return res.status(404).json({ message: "Not found products in request" });
    }
    return await this.farmerService.getFarmersByProduct(product);
}


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
    @UseBefore(AuthenticationMiddleware)
    @Post("/createBag")     // Создание Bag, доступно из фронтенда только для фермеров
     async createBag(
        @Body() newBagDto: NewBagDto,
        @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
        @Res() res: Response
    ) {
        if (req.body.farmer.role !== 'farmer') {
            return res.status(403).json({ message: "You are not a farmer" });
        }
        const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена
        return this.farmerService.createBag(newBagDto, authenticatedUserLogin);
     }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Put('/updateBag/:name')
     async updateBag(
         @Param('name') name: string,
         @Body() updateBagDto: { product: string, description: string, date: string }, // Изменяем тип данных
         @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
         @Res() res: Response         
     ) {
        if (req.body.farmer.role !== 'farmer') {
            return res.status(403).json({ message: "You are not a farmer" });
        }
         const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена
        
         return this.farmerService.updateBag(
             authenticatedUserLogin, // Передаем login из токена
             name,
             updateBagDto.product, 
             updateBagDto.description,
             updateBagDto.date
         );
     }


     @UseBefore(AuthenticationMiddleware)
     @Delete('/removeBag/:name')
     async removeBag(
         @Param('name') name: string,
         @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
         @Res() res: Response         
     ) {
        if (req.body.farmer.role !== 'farmer') {
            return res.status(403).json({ message: "You are not a farmer" }); 
        }      
         const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена
     
         return this.farmerService.removeBag(
            authenticatedUserLogin, // Передаем login из токена
            name
        );
    }


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
    @UseBefore(AuthenticationMiddleware)
    @Get('/getBagsByProduct/:product')
    async getBagsByProduct(
        @Param('product') product: string,     
    ) { return await this.farmerService.getBagsByProduct(product)
}   


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
    @UseBefore(AuthenticationMiddleware)
    @Get('/getBagsByFarmer/:login')
    async getBagsByFarmer(
    @Param('login') login: string,     
    ) { return await this.farmerService.getBagsByFarmer(login)
    }


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
    @UseBefore(AuthenticationMiddleware)
    @Get('/getOwnBags')
    async getOwnBags(
    @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
    @Res() res: Response  
    ) { 
        if (req.body.farmer.role !== 'farmer') {
        return res.status(403).json({ message: "You are not a farmer" }); 
    } 
        const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена
     
        return await this.farmerService.getOwnBags(authenticatedUserLogin)
    }


//@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
@UseBefore(AuthenticationMiddleware)
@Get('/getOwnBagsWithOrder')
async getOwnBagsWithOrder(
    @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
    @Res() res: Response
) {
    if (req.body.farmer.role !== 'farmer') {
        return res.status(403).json({ message: "You are not a farmer" }); 
    } 
    const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена

    return await this.farmerService.getOwnBagsWithOrder(authenticatedUserLogin);
}


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
    @UseBefore(AuthenticationMiddleware)
    @Put('/confirmOrder/:bagName')
    async confirmOrder(
        @Param('bagName') bagName: string,
        @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
        @Res() res: Response
    ) {
        if (req.body.farmer.role !== 'farmer') {
            return res.status(403).json({ message: "You are not a farmer" }); 
        } 
        const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена
    
        return await this.farmerService.confirmOrder(authenticatedUserLogin, bagName);
    }


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Put('/confirmPayment/:bagName')
     async confirmPayment(
          @Param('bagName') bagName: string,
          @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
          @Res() res: Response
     ) {
          if (req.body.farmer.role !== 'farmer') {
               return res.status(403).json({ message: "You are not a farmer" });
           }
          const authenticatedUserLogin = req.body.farmer.login; // Получаем login из токена
          return await this.farmerService.confirmPayment(authenticatedUserLogin, bagName);
     }

}