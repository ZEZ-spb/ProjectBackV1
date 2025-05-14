import {Document, Schema, model} from 'mongoose';

export interface IFarmer extends Document {
    login:string;
    password:string;
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    address:string;
    postalCode:string;
    role: string; 
}

const farmerSchema = new Schema<IFarmer>(
    {
        login: {type: String, required: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true},
        postalCode: {type: String, required: true},
        role: {type: String, default: 'farmer'}
    }
);

export const Farmer = model<IFarmer>('Farmer', farmerSchema);