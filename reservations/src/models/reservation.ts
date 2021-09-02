// A model for each order of a facility reservation
import mongoose from 'mongoose';
import { FacilityTicketDoc } from './facility';
import {ReservationStatus} from '@dfacilitiesorg/common';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
export {ReservationStatus};

// An interface which describes the properties given to the 
// build function of a Reservation
interface ReservationAttrs {
    userID: string;
    status: ReservationStatus;
    ticket: FacilityTicketDoc;
}

// An interface which describes the fields in a document for
// a reservation made by the user
interface ReservationDoc extends mongoose.Document{
    userID: string;
    status: ReservationStatus;
    ticket: FacilityTicketDoc;
    version: number;
}

// An interface to define the model for a Reservation
interface ReservationModel extends mongoose.Model<ReservationDoc>{
    build(attrs: ReservationAttrs): ReservationDoc;
}

const FacilityReservationSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(ReservationStatus),
        default: ReservationStatus.Created
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

FacilityReservationSchema.statics.build = (attrs: ReservationAttrs) => {
    return new FacilityReservation(attrs);
};

FacilityReservationSchema.set('versionKey', 'version');
FacilityReservationSchema.plugin(updateIfCurrentPlugin);
const FacilityReservation = mongoose.model<ReservationDoc, ReservationModel>('Order', FacilityReservationSchema);

export {FacilityReservation};