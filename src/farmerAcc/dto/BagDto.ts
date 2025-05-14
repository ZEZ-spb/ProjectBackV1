export default class BagDto {
    private _login:string;  // login of the farmer who owns the bag
    private _name:string;
    private _product:string;   
    private _description:string;
    private _date:string; 
    private _customer:string; // login of the customer who ordered the bag
    private _confirmation: boolean; // confirmation of the order
    private _payment: boolean; // payment status of the order, default is false (from the client side)
    private _confirmPayment: boolean; // payment status of the order, default is false (from the farmer side)


    constructor(login: string, name:string, product: string, description: string, date: string, 
        customer: string, confirmation: boolean = false, payment: boolean = false, confirmPayment: boolean = false) {    
        this._login = login;
        this._name = name;
        this._product = product;
        this._description = description;
        this._date = date;
        this._customer = customer; // default value for customer
        this._confirmation = confirmation; // default value for confirmation
        this._payment = payment; // default value for payment
        this._confirmPayment = confirmPayment; // default value for confirmPayment
    }

    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get product(): string {
        return this._product;
    }

    set product(value: string) {
        this._product = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get date(): string {
         return this._date;
     }

    set date(value: string) {
         this._date = value;
     }

    get customer(): string {
        return this._customer;
    }

    set customer(value: string) {
        this._customer = value;
    }

    get confirmation(): boolean {
        return this._confirmation;
    }

    set confirmation(value: boolean) {
        this._confirmation = value;
    }

    get payment(): boolean {
        return this._payment;
    }

    set payment(value: boolean) {
        this._payment = value;
    }

    get confirmPayment(): boolean {
        return this._confirmPayment;
    }

    set confirmPayment(value: boolean) {
        this._confirmPayment = value;
    }
    
    toString(): string {
        return `BagDto { login: ${this._login}, product: ${this._product}, description: ${this._description}, 
        date: ${this._date}, customer: ${this._customer}, confirmation: ${this._confirmation}, 
        payment: ${this._payment}, confirmPayment: ${this._confirmPayment} }`; 
    }
    
}