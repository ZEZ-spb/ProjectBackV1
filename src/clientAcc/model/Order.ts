import {Document, Schema, model} from 'mongoose';

export interface IOrder extends Document {
    customer:string;  // login of the client who ordered this bag
    farmer:string;  // login of the farmer which bag is ordered
    bagName:string;  // name of the bag
}

const orderSchema = new Schema<IOrder>(
    {       
        customer: {type: String, required: true},
        farmer: {type: String, required: true},
        bagName: {type: String, required: true},
      } 
);

export const Order = model<IOrder>('Order', orderSchema);