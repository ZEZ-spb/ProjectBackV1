import FarmerService from "./FarmerService";
import NewFarmerDto from "../dto/NewFarmerDto";
import FarmerDto from "../dto/FarmerDto";
import {Farmer} from "../model/Farmer";
import {ForbiddenError, HttpError, NotFoundError} from "routing-controllers";
import {encodeBase64} from "../utils/utilsForPassword";
import jwt from "jsonwebtoken";
import BagDto from "../dto/BagDto";
import {Bag} from "../model/Bag";
import NewBagDto from "../dto/NewBagDto";
//import expressAsyncHandler from "express-async-handler";
//import { Request, Response, NextFunction } from "express";
//import createHttpError from "http-errors";

export default class FarmerServiceImpl implements FarmerService {


    async register(newFarmerDto: NewFarmerDto): Promise<FarmerDto> {
        let encodePass = encodeBase64(newFarmerDto.password);
        const existingFarmer = await Farmer.findOne({ login: newFarmerDto.login });
    
        if (existingFarmer) {
            throw new HttpError(409, `Farmer with login ${newFarmerDto.login} already exists`);
        }
    
        const newFarmer = new Farmer({
            ...newFarmerDto,
            role: "farmer",
            password: encodePass
        });
    
        const res = await newFarmer.save();
        return new FarmerDto(res.login, res.firstName, res.lastName, res.email, res.phone, res.address, 
            res.postalCode)

    }


    async login(login: string, password: string): Promise<string> {
         const farmer = await Farmer.findOne({login: login});
         if (farmer === null) {
             throw new HttpError(404, `Farmer with login ${login} not found`);
        }           
         const pass = farmer.password;
         const encodePass = encodeBase64(password);
         if (pass !== encodePass) {
             throw new HttpError(401, `Password not valid`);
         }
         return jwt.sign({login: farmer.login, role: farmer.role}, '' + process.env.JWT_SECRET,
         //return jwt.sign({login: farmer.login}, '' + process.env.JWT_SECRET,
              {expiresIn: process.env.EXPIRED_TIME as any}); // 1 hour
    }


    async updatePassword(
        login: string,
        newPassword: string
    ): Promise<FarmerDto> {
        const farmer = await Farmer.findOneAndUpdate(
            { login: login },
            { password: encodeBase64(newPassword) },
            { new: true }
        );
    
        if (farmer === null) {
            throw new NotFoundError(`Farmer with login ${login} not found`);
        }
    
        return new FarmerDto(
            farmer.login, farmer.firstName, farmer.lastName,
            farmer.email, farmer.phone, farmer.address,
            farmer.postalCode
        );        
    }


    async updateFarmer(
        login: string, // login пользователя, чьи данные хотят изменить
        firstName: string, lastName: string,
        email: string, phone: string,
        address: string, postalCode: string,
    ): Promise<FarmerDto> {
    
        const farmer = await Farmer.findOneAndUpdate(
            { login: login },
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    address: address,
                    postalCode: postalCode,
                }
            },
            { new: true }
        );
    
        if (farmer === null) {
            throw new NotFoundError(`Farmer with login ${login} not found`);
        }
    
        return new FarmerDto(
            farmer.login, farmer.firstName, farmer.lastName,
            farmer.email, farmer.phone, farmer.address,
            farmer.postalCode
        );
    } 


    async removeFarmer(
        login: string
    ): Promise<FarmerDto> {

         const farmer = await Farmer.findOne({login: login});
         if (farmer === null) {
             throw new HttpError(404, `Farmer with login ${login} not found`);
         }
            const bags = await Bag.find({login: login});
            bags.map(bag => {if (bag.customer !== 'none') {     // если у фермера заказы, то он не может быть удалён
                throw new ForbiddenError(`Farmer with login ${login} has orders`);
            }})
            await Promise.all(bags.map(bag => bag.deleteOne())); // Удаляем все СБ, связанные с фермером   
            await farmer.deleteOne();
         return new FarmerDto(farmer.login, farmer.firstName, farmer.lastName,
            farmer.email, farmer.phone, farmer.address,
            farmer.postalCode)
    }


    async getFarmerByLogin(login: string): Promise<FarmerDto> {  //Пока не надо, м.б. потом для клиента
         const farmer = await Farmer.findOne({login: login});
         if (farmer === null) {
             throw new HttpError(404, `Farmer with login ${login} not found`);
         }
         return new FarmerDto(farmer.login, farmer.firstName, farmer.lastName,  farmer.email, farmer.phone, farmer.address, 
            farmer.postalCode)
     }


    async getAllFarmers(): Promise<FarmerDto[]> {   //Пока не надо, м.б. потом для клиента
         const farmers = await Farmer.find();
         if (farmers.length === 0) {
             throw new HttpError(404, 'Farmers not found');
         }
         return farmers.map(farmer => {
             return new FarmerDto(farmer.login, farmer.firstName, farmer.lastName,  farmer.email, farmer.phone, farmer.address, 
                farmer.postalCode)
         });
     }


    async getFarmersByProduct(product: string): Promise<FarmerDto[]> {  
        const bags = await Bag.find({ product:product,customer:'none'});
        if (bags.length === 0) {
            throw new HttpError(404, `Farmers with product ${product} not found`);
        }
  
        const farmers: FarmerDto[] = [];
        await Promise.all(bags.map(async (bag) => {
            if (bag.product === product) {
                const farmer = await this.getFarmerByLogin(bag.login);
                if (!farmers.some(f => f.login === farmer.login)) {
                    farmers.push(farmer);
                }
            }
        }));

        return farmers.map(farmer => {
            return new FarmerDto(farmer.login, farmer.firstName, farmer.lastName,  farmer.email, farmer.phone, farmer.address, 
               farmer.postalCode)
        });
    }

 
    async createBag(newBagDto: NewBagDto, authenticatedUserLogin:string ): Promise<BagDto> {
        const existingBag = await Bag.findOne({ login: authenticatedUserLogin, name: newBagDto.name });
        if (existingBag) {
            throw new HttpError(409, `Bag with name ${newBagDto.name} already exists for this farmer`)
        }
        
            const newBag = new Bag({
            ...newBagDto,
            login: authenticatedUserLogin,
            });
        
        const res = await newBag.save();
        
         return new BagDto(res.login, res.name, res.product, res.description, 
            res.date, res.customer, res.confirmation, res.payment, res.confirmPayment);
    }


    async updateBag(
        authenticatedUserLogin: string, // login пользователя из токена
        name: string, 
        product: string, 
        description: string, 
        date: string
    ): Promise<BagDto> {

        const existingBag = await Bag.findOne({ login: authenticatedUserLogin, name: name });
        if (existingBag === null) {
            throw new HttpError(404, `Bag with name ${name} not found`)
        }

        if (existingBag.customer && existingBag.customer !== 'none') {
            throw new ForbiddenError(`Bag with name ${name} is already ordered by customer ${existingBag.customer}`);
        }
    
        const newBag = await Bag.findOneAndUpdate(
            { login: authenticatedUserLogin, name: name },
            {
                $set: {
                    product: product,
                    description: description,
                    date: date
                }
            },
            { new: true }
        );

        if (newBag === null) {
            throw new HttpError(404, `Bag with name ${name} not found`);
        }

        
        return new BagDto(
            newBag.login, newBag.name, newBag.product, newBag.description, newBag.date, 
            newBag.customer, newBag.confirmation, newBag.payment, newBag.confirmPayment
        );
    }


    async removeBag(authenticatedUserLogin: string, // login пользователя из токена
        name: string, // 
    ): Promise<BagDto> {
        const existingBag = await Bag.findOne({ login: authenticatedUserLogin, name: name });
        if (existingBag === null) {
            throw new HttpError(404, `Bag with name ${name} not found`);
        } 

        if(existingBag.customer && existingBag.customer !== 'none') {
            throw new ForbiddenError(`Bag with name ${name} is already ordered by customer ${existingBag.customer}`);
        }
        await existingBag.deleteOne(); // Удаляем существующий СБ

        return new BagDto(existingBag.login, existingBag.name, existingBag.product, existingBag.description, 
            existingBag.date, existingBag.customer, existingBag.confirmation, existingBag.payment, existingBag.confirmPayment);
    }


    async getBagsByProduct(product: string): Promise<BagDto[]> {
        const bags = await Bag.find({ product: product, customer: 'none'});
        if (bags.length === 0) {
            throw new HttpError(404, `Bags with product ${product} not found`);
        }
        return bags.map(bag => {
            return new BagDto(bag.login, bag.name, bag.product, bag.description, bag.date, 
                bag.customer, bag.confirmation, bag.payment, bag.confirmPayment)
        });
    }


    async getBagsByFarmer(login: string): Promise<BagDto[]> {
        const bags = await Bag.find({ login: login, customer: 'none'  });
        if (bags.length === 0) {
            throw new HttpError(404, `Bags with farmer ${login} not found`);
        }
        return bags.map(bag => {
            return new BagDto(bag.login, bag.name, bag.product, bag.description, bag.date, 
                bag.customer, bag.confirmation, bag.payment, bag.confirmPayment)
        });
    }


    async getOwnBags(authenticatedUserLogin: string): Promise<BagDto[]> {
        const bags = await Bag.find({ login: authenticatedUserLogin});
        if (bags.length === 0) {
            throw new HttpError(404, `Bags with farmer ${authenticatedUserLogin} not found`);
        }
        return bags.map(bag => {
            return new BagDto(bag.login, bag.name, bag.product, bag.description, bag.date, 
                bag.customer, bag.confirmation, bag.payment, bag.confirmPayment)
        });
    } 


    async getOwnBagsWithOrder(authenticatedUserLogin: string): Promise<BagDto[]> {
        const bags = await Bag.find({ login: authenticatedUserLogin, customer: { $ne: 'none' } });
        if (bags.length === 0) {
            throw new HttpError(404, `Orders to farmer ${authenticatedUserLogin} not found`);
        }
        return bags.map(bag => {
            return new BagDto(bag.login, bag.name, bag.product, bag.description, bag.date, 
                bag.customer, bag.confirmation, bag.payment, bag.confirmPayment)
        });
    }


    async confirmOrder(authenticatedUserLogin: string, bagName: string): Promise<BagDto> {
        const bag = await Bag.findOne({ login: authenticatedUserLogin, name: bagName, 
            customer: { $ne: 'none' }, confirmation: false });
        if (bag === null) {
            throw new HttpError(404, `Bag with name ${bagName} or not found, or haven't customer, or already confirmed`);
        }
        else {
            bag.confirmation = true; // Устанавливаем confirmation в true
            bag.save();
         };
    
        return new BagDto(
            bag.login, bag.name, bag.product, bag.description, bag.date, 
            bag.customer, bag.confirmation, bag.payment, bag.confirmPayment
        );
    }


    async confirmPayment(authenticatedUserLogin: string, bagName: string): Promise<BagDto> {
        const bag = await Bag.findOne({ login: authenticatedUserLogin, name: bagName, 
            customer: { $ne: 'none' }, confirmation: true, payment: true, confirmPayment: false });
        if (bag === null) {
            throw new HttpError(404, `Bag with name ${bagName} or not found, or haven't customer, or already confirmed, or payment already confirmed`);
        }    
        bag.confirmPayment = true; // set the payment confirmation to true
        await bag.save();           // save the updated bag to the database
        return new BagDto(bag.login, bag.name, bag.product, bag.description,
            bag.date, bag.customer, bag.confirmation, bag.payment, bag.confirmPayment);
    }


}
   

    // async addUserRole(login: string, role: string): Promise<UserDto> {
    //     const user = await User.findOneAndUpdate({login: login}, {$addToSet: {roles: role}}, {new: true});
    //     if (user === null) {
    //         throw new NotFoundError(`User with login ${login} not found`);
    //     }
    //     return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    // }


    // async removeRole(login: string, role: string): Promise<UserDto> {
    //     const user = await User.findOneAndUpdate({login: login}, {$pull: {roles: role}}, {new: true});
    //     if (user === null) {
    //         throw new NotFoundError(`User with login ${login} not found`);
    //     }
    //     return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    // }
    

//}