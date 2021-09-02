// A model for the facility tickets on the system
import mongoose from 'mongoose';
import {ReservationStatus, FacilityReservation} from './reservation';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface FacilityTicketAttrs{
    id: string;
    title: string;
    price: number;
}


export interface FacilityTicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface FacilityTicketModel extends mongoose.Model<FacilityTicketDoc>{
    build(attrs: FacilityTicketAttrs): FacilityTicketDoc;
    findByEvent(event: {id: string, version:number}): Promise<FacilityTicketDoc | null>;
}

const FacilityTicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON:{
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});


FacilityTicketSchema.set('versionKey', 'version');
FacilityTicketSchema.plugin(updateIfCurrentPlugin);

FacilityTicketSchema.statics.build = (attrs: FacilityTicketAttrs) => {
    return new FacilityTicket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

FacilityTicketSchema.statics.findByEvent = (event:{id: string, version:number} ) => {
    return FacilityTicket.findOne({
        _id: event.id,
        version: event.version - 1
    })
}   


FacilityTicketSchema.methods.isReserved = async function() {
    // this === ticket document that just called "isReserved" on

    // Run query to look at all orders and find an order where
    // the ticket is the ticket we just found AND ther orders status is NOT cancelled.
    // If we find an order from that means the ticket IS reserved
    const existingReservation = await FacilityReservation.findOne({
        ticket: this as any,
        status: {
            $in: [
                ReservationStatus.Created,
                ReservationStatus.AwaitingPayment,
                ReservationStatus.Complete
            ]
        }
    });

    return !!existingReservation;
}

const FacilityTicket = mongoose.model<FacilityTicketDoc, FacilityTicketModel>('Ticket', FacilityTicketSchema);

export {FacilityTicket};
