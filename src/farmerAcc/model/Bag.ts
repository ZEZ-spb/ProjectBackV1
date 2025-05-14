import {Document, Schema, model} from 'mongoose';

export interface IBag extends Document {
    login:string;   // login of the farmer who owns the bag
    name:string;
    product:string;
    description:string;
    date:string,
    customer:string; // login of the customer who ordered the bag
    confirmation: boolean; // confirmation of the order from the farmer
    payment: boolean; // payment status of the order, default is false (from the client side)
    confirmPayment: boolean; // payment status of the order, default is false (from the farmer side)
}

const bagSchema = new Schema<IBag>(
    {   
        login: {type: String, required: true},
        name: {type: String, required: true},
        product: {type: String, required: true},
        description: {type: String, required: true},
        date: { type: String, required: true},
        customer: {type: String, required: true, default: 'none'},
        confirmation: {type: Boolean, required: true, default: false},
        payment: {type: Boolean, required: true, default: false},
        confirmPayment: {type: Boolean, required: true, default: false} 
      } 
);

export const Bag = model<IBag>('Bag', bagSchema);