import {Document, Schema, model} from 'mongoose';

export interface IClient extends Document {
    login:string;
    password:string;
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    role: string; 
}

const clientSchema = new Schema<IClient>(
    {
        login: {type: String, required: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        role: {type: String, default: 'client'}
    }
);

export const Client = model<IClient>('Client', clientSchema);