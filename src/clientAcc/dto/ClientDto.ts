export default class ClientDto {
    private _login:string;
    private _firstName:string;
    private _lastName:string;
    private _email:string;
    private _phone:string;
    private _role:string = 'client'; 


    constructor(login: string, firstName: string, lastName: string, email:string, phone:string, role:string) {    
        this._login = login;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._phone = phone;
        this._role = 'client';
    }

    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }
    get phone(): string {
        return this._phone;
    }

    set phone(value: string) {
        this._phone = value;
    }

    get role(): string {
        return this._role;
    }

    toString(): string {
        return `FarmerDto { role: ${this._role}, login: ${this._login}, firstName: ${this._firstName}, 
        lastName: ${this._lastName}, email: ${this._email}, phone: ${this._phone} }`;
    }
}