import NewFarmerDto from "../dto/NewFarmerDto";
import FarmerDto from "../dto/FarmerDto";
import BagDto from "../dto/BagDto";
import NewBagDto from "../dto/NewBagDto";

export default interface FarmerService {

    register(
        newFarmerDto: NewFarmerDto
    ): Promise<FarmerDto>;

    login(
        login:string, password:string
    ): Promise<string>;

    updatePassword(
        login: string, 
        newPassword: string
    ): Promise<FarmerDto>;

    updateFarmer(
        login: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        address: string,
        postalCode: string
    ): Promise<FarmerDto>;

    removeFarmer(
        login: string
    ) : Promise<FarmerDto>;

    getFarmerByLogin(
        login: string
    ) : Promise<FarmerDto>;

    getAllFarmers(        
    ): Promise<FarmerDto[]>;

    getFarmersByProduct(
        product: string
    ): Promise<FarmerDto[]>;

    createBag(
        newBagDto: NewBagDto, 
        authenticatedUserLogin:string
    ): Promise<BagDto>;

    updateBag(
        authenticatedUserLogin: string, // Добавлен параметр для проверки
        name: string,
        product: string,
        description: string,
        date: string
    ): Promise<BagDto>;

    removeBag(
        authenticatedUserLogin: string, // Добавлен параметр для проверки
        name: string
    ): Promise<BagDto>;

    getBagsByProduct(
        product: string
    ): Promise<BagDto[]>;

    getBagsByFarmer(
        login: string
    ): Promise<BagDto[]>;

    getOwnBags(
        authenticatedUserLogin: string // Добавлен параметр для проверки
    ): Promise<BagDto[]>;
    
    getOwnBagsWithOrder(
        authenticatedUserLogin: string // Добавлен параметр для проверки
    ): Promise<BagDto[]>;
    
    confirmOrder(
        authenticatedUserLogin: string, // Добавлен параметр для проверки   
        bagName: string,
    ): Promise<BagDto>;

    confirmPayment(
        authenticatedUserLogin: string, 
        bagName: string
    ): Promise<BagDto>;

    
}