import { EventTypes } from "../event-types";
import { ReservationStatus } from "../reservation-status-types";

export interface FacilityReservationCreatedEvent{
    subject: EventTypes.FacilityReservationCreated;
    data: {
        id: string;
        version: number;
        status: ReservationStatus;
        userId: string;
        ticket: {
            id: string;
            price: number;
        }
    }
}