export default class OrderDto {
    private _customer:string;  // login of the client who ordered this bag
    private _farmer:string;    // login of the farer which bag is ordered
    private _bagName:string;   // name of the bag

    constructor(customer:string, farmer:string, bagName: string) {  
        this._customer = customer; // default value for customer
        this._farmer = farmer; // default value for login
        this._bagName = bagName; // default value for name        
    }

    get customer(): string {
        return this._customer;
    }

    set customer(value: string) {
        this._customer = value;
    }

    get farmer(): string {
        return this._farmer;
    }

    set farmer(value: string) {
        this._farmer = value;
    }

    get bagName(): string {
        return this._bagName;
    }

    set bagName(value: string) {
        this._bagName = value;
    }

    
    
    toString(): string {
        return `OrdeDto {customer: ${this._customer}, farmer: ${this._farmer}, bagName: ${this._bagName}}`; 
    }
    
}