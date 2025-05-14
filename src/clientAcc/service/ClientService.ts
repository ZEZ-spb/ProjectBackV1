import NewClientDto from "../dto/NewClientDto";
import ClientDto from "../dto/ClientDto";
//import OrderDto from "../dto/OrderDto";
//import NewOrderDto from "../dto/NewOrderDto";
import BagDto from "../../farmerAcc/dto/BagDto";

export default interface ClientService {
    
    payment(authenticatedUserLogin: any, farmer: string, bagName: string): unknown;

    register(
        newUserDto: NewClientDto
    ): Promise<ClientDto>;

    login(
        login:string, 
        password:string
    ): Promise<string>;

    updatePassword(
        login: string, 
        newPassword: string
    ): Promise<ClientDto>;

    updateClient(
            login: string,
            firstName: string,
            lastName: string,
            email: string,
            phone: string,
        ): Promise<ClientDto>;

    removeClient(
        login: string
    ): Promise<ClientDto>;

    createOrder(
        customer: string, 
        farmer: string, 
        bagName: string
    ): Promise<BagDto>;

    getBagsWithOwnOrders(
        customer: string // Добавлен параметр для проверки
    ): Promise<BagDto[]>; 
        
    cancelOrder(
        customer: string, 
        farmer: string, 
        bagName: string
    ): Promise<BagDto>;

    payment(
        customer: string, 
        farmer: string, 
        bagName: string
    ): Promise<BagDto>;

    receiving(
        customer: string, 
        farmer: string, 
        bagName: string
    ): Promise<BagDto>;
        
}