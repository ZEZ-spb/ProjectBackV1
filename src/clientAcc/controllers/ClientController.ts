import {Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res, UseBefore} from "routing-controllers";
import NewClientDto from "../dto/NewClientDto";
import ClientService from "../service/ClientService";
import ClientServiceImpl from "../service/ClientServiceImpl";
import {AuthenticationMiddleware} from "../Middleware/AuthenticationMiddleware";
//import {AuthorizationMiddleware} from "../Middleware/AuthorizationMiddleware";
//import expressAsyncHandler from "express-async-handler";
//import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
//import {ForbiddenError, HttpError, NotFoundError} from "routing-controllers";
//import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
//import { NextFunction } from "express";
//import OrderDto from "../dto/OrderDto";
import NewOrderDto from "../dto/NewOrderDto";


@Controller('/client')

export default class ClientController {

     clientService: ClientService = new ClientServiceImpl();


     @Post("/register")
          async register(
             @Body() newClientDto: NewClientDto
         ) {
              return this.clientService.register(newClientDto);
          } 


     @Post("/login")
          async login(
             @Body() loginDto: { login: string, password: string }, 
             @Res() res: Response
         ) {
              const token =  await this.clientService.login(loginDto.login, loginDto.password);
               return res.json({token});
          }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Put('/updatePassword')
          ///:login')     //логин того, чей пароль меняем
          async updatePassword(
               //@Param('login') login: string,
               @Body() body: { newPassword: string },
               @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
               @Res() res: Response         
          ) {  
               if (req.body.client.role !== 'client') {
                    return res.status(403).json({ message: "You are not a client" });
                }
               const authenticatedUserLogin = req.body.client.login; // Получаем login из токена
             
               // if (authenticatedUserLogin !== login) {
               //      return res.status(403).json({ message: "You can only update your own password" });
               // }

               const newPassword = body.newPassword; // Извлекаем новый пароль из тела запроса

               return await this.clientService.updatePassword(
                    authenticatedUserLogin,
                    newPassword
               );
             }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)   
          @UseBefore(AuthenticationMiddleware)
          @Put('/update')
               ///:login')
          async updateClient(
              //@Param('login') login: string,
              @Body() updateClientDto: NewClientDto,
              @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
              @Res() res: Response         
          ) {
               if (req.body.client.role !== 'client') {
                    return res.status(403).json({ message: "You are not a client" });
                }
              const authenticatedUserLogin = req.body.client.login; // Получаем login из токена
          
          //     if (authenticatedUserLogin !== login) {
          //         return res.status(403).json({ message: "You can only update your own profile" });
          //     }
          
              return await this.clientService.updateClient(
                    authenticatedUserLogin,
                    updateClientDto.firstName, updateClientDto.lastName,
                    updateClientDto.email, updateClientDto.phone,
               );
          }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Delete('/remove')
          ///:login')
     async removeClient(
        //@Param('login') login: string,
        @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware 
        @Res() res: Response        
    ) {
          if (req.body.client.role !== 'client') {
               return res.status(403).json({ message: "You are not a client" });
           }
          const authenticatedUserLogin = req.body.client.login; // Получаем login из токена
     
          // if (authenticatedUserLogin !== login) {
          //    return res.status(403).json({ message: "You can only remove your own account" });
          // }
          return await this.clientService.removeClient(
               authenticatedUserLogin
        );
    }


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
    @UseBefore(AuthenticationMiddleware)
    @Post('/createOrder')
    async createOrder(
     @Body() newOrderDto: NewOrderDto,
     @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware 
     @Res() res: Response
 )
    {
          if (req.body.client.role !== 'client') {
               return res.status(403).json({ message: "You are not a client" });
           }
          const authenticatedUserLogin = req.body.client.login; // Получаем customer login из токена
          return await this.clientService.createOrder(authenticatedUserLogin, newOrderDto.farmer, newOrderDto.bagName);
    }


    //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
        @UseBefore(AuthenticationMiddleware)
        @Get('/getBagsWithOwnOrders')
          ///:login')
        async getBagsWithOwnOrders(
            //@Param('login') login: string,
            @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
            @Res() res: Response
        ) {
               if (req.body.client.role !== 'client') {
                    return res.status(403).json({ message: "You are not a client" });
               }
            const authenticatedUserLogin = req.body.client.login; // Получаем login из токена
        
          //   if (authenticatedUserLogin !== login) {
          //       return res.status(403).json({ message: "You can see only your own orders" });
          //   }
        
            return await this.clientService.getBagsWithOwnOrders(authenticatedUserLogin);
        }
        
        
     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Put('/cancelOrder')
     async cancelOrder(
          @Body() body: {farmer: string, bagName: string},
          @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
          @Res() res: Response
     ) {
          if (req.body.client.role !== 'client') {
               return res.status(403).json({ message: "You are not a client" });
           }
          const authenticatedUserLogin = req.body.client.login; // Получаем login из токена
          return await this.clientService.cancelOrder(authenticatedUserLogin, body.farmer, body.bagName);
     }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Put('/payment')
     async payment(
          @Body() body: {farmer: string, bagName: string},
          @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
          @Res() res: Response
     ) {
          if (req.body.client.role !== 'client') {
               return res.status(403).json({ message: "You are not a client" });
           }
          const authenticatedUserLogin = req.body.client.login; // Получаем login из токена
          return await this.clientService.payment(authenticatedUserLogin, body.farmer, body.bagName);
     }


     //@UseBefore(AuthenticationMiddleware, AuthorizationMiddleware)
     @UseBefore(AuthenticationMiddleware)
     @Delete('/receiving')
     async receiving(
          @Body() body: {farmer: string, bagName: string},
          @Req() req: Request, // Добавляем Request, чтобы получить данные из middleware
          @Res() res: Response
     ) {
          if (req.body.client.role !== 'client') {
               return res.status(403).json({ message: "You are not a client" });
           }
          const authenticatedUserLogin = req.body.client.login; // Получаем login из токена
          return await this.clientService.receiving(authenticatedUserLogin, body.farmer, body.bagName);
     }



     


}