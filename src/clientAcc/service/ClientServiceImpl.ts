import ClientService from "./ClientService";
import NewClientDto from "../dto/NewClientDto";
import ClientDto from "../dto/ClientDto";
import {Client} from "../model/Client";
import {ForbiddenError, HttpError, NotFoundError} from "routing-controllers";
import {encodeBase64} from "../../farmerAcc/utils/utilsForPassword";
import jwt from "jsonwebtoken";
import { Bag } from "../../farmerAcc/model/Bag";
import BagDto from "../../farmerAcc/dto/BagDto";
//import expressAsyncHandler from "express-async-handler";
//import { Request, Response, NextFunction } from "express";
//import createHttpError from "http-errors";

export default class ClientServiceImpl implements ClientService {


    async register(newClientDto: NewClientDto): Promise<ClientDto> {
        let encodePass = encodeBase64(newClientDto.password);
        const existingClient = await Client.findOne({ login: newClientDto.login });
    
        if (existingClient) {
            throw new HttpError(409, `Client with login ${newClientDto.login} already exists`);
        }
    
        const newClient = new Client({
            ...newClientDto,
            role: "client",
            password: encodePass
        });
    
        const res = await newClient.save();
        return new ClientDto(res.login, res.firstName, res.lastName, res.email, res.phone, res.role);
    }


    async login(login: string, password: string): Promise<string> {
        const client = await Client.findOne({login: login});
        if (client === null) {
            throw new HttpError(404, `Client with login ${login} not found`);    
             }
        const pass = client.password;
        const encodePass = encodeBase64(password);
        if (pass !== encodePass) {
            throw new HttpError(401, `Password not valid`);
        }
        return jwt.sign({login: client.login, role: client.role}, '' + process.env.JWT_SECRET,
        //return jwt.sign({login: client.login}, '' + process.env.JWT_SECRET,
            {expiresIn: process.env.EXPIRED_TIME as any});
        }


    async updatePassword(
            login: string,
            newPassword: string
        ): Promise<ClientDto> {
           const client = await Client.findOneAndUpdate(
               { login: login },
               { password: encodeBase64(newPassword) },
               { new: true }
           );
       
           if (client === null) {
               throw new NotFoundError(`Client with login ${login} not found`);
           }
       
           return new ClientDto(
                client.login, client.firstName, client.lastName,
                client.email, client.phone, client.role
           );
       } 


    async updateClient(
               login: string, // login пользователя, чьи данные хотят изменить
               firstName: string, lastName: string,
               email: string, phone: string,
           ): Promise<ClientDto> {
           
               const client = await Client.findOneAndUpdate(
                   { login: login },
                   {
                       $set: {
                           firstName: firstName,
                           lastName: lastName,
                           email: email,
                           phone: phone
                       }
                   },
                   { new: true }
               );
           
               if (client === null) {
                   throw new NotFoundError(`Client with login ${login} not found`);
               }
           
               return new ClientDto(
                   client.login, client.firstName, client.lastName,
                   client.email, client.phone, client.role
               );
           } 


    async removeClient(
            login: string
        ): Promise<ClientDto> {
    
             const client = await Client.findOne({login: login});
             if (client === null) {
                 throw new HttpError(404, `Farmer with login ${login} not found`);
             }
                const bags = await Bag.find({customer: login});
                await Promise.all(bags.map(bag => {
                    bag.customer = 'none';
                    return bag.save();
                })); 

                await client.deleteOne();
             return new ClientDto(client.login, client.firstName, client.lastName,
                client.email, client.phone, client.role);
        }


    async getClientByLogin(login: string): Promise<ClientDto> {  
         const client = await Client.findOne({login: login});
         if (client === null) {
             throw new HttpError(404, `Client with login ${login} not found`);
         }
         return new ClientDto(client.login, client.firstName, client.lastName,  
            client.email, client.phone, client.role)
     }



        
        
    async createOrder(customer: string, farmer: string, bagName: string): Promise<BagDto> {

        const bag = await Bag.findOne({login:farmer, name: bagName});
        if (bag === null) {
            throw new HttpError(404, `Bag from farmer ${farmer} with name ${bagName} not found`);
        }
        if (bag.customer !== 'none') {
            throw new ForbiddenError(`Bag from farmer ${farmer} with name ${bagName} is already ordered`);
        }

        bag.customer = customer; // set the customer of the bag to the client who ordered it
        await bag.save(); // save the updated bag to the database
        return new BagDto(bag.login, bag.name, bag.product, bag.description, 
            bag.date, bag.customer, bag.confirmation, bag.payment, bag.confirmPayment);
    }


    async getBagsWithOwnOrders(customer: string): Promise<BagDto[]> {
        const bags = await Bag.find({ customer: customer });
        if (bags.length === 0) {
            throw new HttpError(404, `Bags with customer ${customer} not found`);
        }
        return bags.map(bag => {    
            return new BagDto(bag.login, bag.name, bag.product, bag.description, 
                bag.date, bag.customer, bag.confirmation, bag.payment, bag.confirmPayment);
        })
    }


    // async getClientsByProduct(product: string): Promise<ClientDto[]> {
    //     const bags = await Bag.find({ product: product, customer: { $ne: 'none' } });
    //     if (bags.length === 0) {
    //         throw new HttpError(404, `No clients found for product ${product}`);
    //     }
    //     const clientsName = new Set<string>();
    //     bags.map(bag => {
    //         if (bag.customer !== 'none') {clientsName.add(bag.customer);              
    //         }
    //     })
    //     const clients = await Client.find({ login: { $in: Array.from(clientsName) } });
    //     if (clients.length === 0) {
    //         throw new HttpError(404, `No clients found for product ${product}`);
    //     }
    //     return clients.map(client => {
    //         return new ClientDto(client.login, client.firstName, client.lastName,
    //             client.email, client.phone, client.role);
    //     });
    // }


    async cancelOrder(customer: string, farmer: string, bagName: string): Promise<BagDto> {
        const bag = await Bag.findOne({ login: farmer, name: bagName });
        if (bag === null) {
            throw new HttpError(404, `Bag from farmer ${farmer} with name ${bagName} not found`);
        }
        if (bag.customer !== customer) {
            throw new ForbiddenError(`You are not the owner of this order`);
        }
        bag.customer = 'none';      // set the customer of the bag to 'none' to cancel the order
        await bag.save();           // save the updated bag to the database
        return new BagDto(bag.login, bag.name, bag.product, bag.description,
            bag.date, bag.customer, bag.confirmation, bag.payment, bag.confirmPayment);
    }


    async getAllProducts(): Promise<string[]> {
        const bags = await Bag.find();
        if (bags.length === 0) {
            throw new HttpError(404, `No products found`);
        }
        const productsSet = new Set<string>();
        bags.forEach(bag => {
            if (bag.product) {
                productsSet.add(bag.product);
            }
        });
        if (productsSet.size === 0) {
            throw new HttpError(404, `No products found`);
        }
        return Array.from(productsSet);
    }


    async payment(customer: string, farmer: string, bagName: string): Promise<BagDto> {;
        const bag = await Bag.findOne({ login: farmer, name: bagName, customer: customer });
        if (bag === null) {
            throw new HttpError(404, `Bag from farmer ${farmer} with name ${bagName} and customer ${customer} not found`);
        }
        if (!bag.confirmation)
            throw new ForbiddenError(`Order not confirmed by farmer`);
        if (bag.payment) {
            throw new ForbiddenError(`Payment already paid`);
        }       
        bag.payment = true; // set the payment confirmation to true
        await bag.save();           // save the updated bag to the database
        return new BagDto(bag.login, bag.name, bag.product, bag.description,
            bag.date, bag.customer, bag.confirmation, bag.payment, bag.confirmPayment);
    }


    async receiving(customer: string, farmer: string, bagName: string): Promise<BagDto> {
        const bag = await Bag.findOne({ login: farmer, name: bagName, customer: customer });
        if (bag === null) {
            throw new HttpError(404, `Bag from farmer ${farmer} with name ${bagName} and customer ${customer} not found`);
        }
        if (!bag.confirmation)
            throw new ForbiddenError(`Order not confirmed by farmer`);
        if (!bag.payment) {
            throw new ForbiddenError(`Payment not paid`);
        }
        if (!bag.confirmPayment) {
            throw new ForbiddenError(`Payment not confirmed by farmer`);
        }
        await bag.deleteOne();
             return new BagDto(bag.login, bag.name, bag.product, bag.description,
            bag.date, bag.customer, bag.confirmation, bag.payment, bag.confirmPayment);
    }

}