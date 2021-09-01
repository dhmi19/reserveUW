import { EventTypes } from "../event-types";

export interface FacilityReservationCancelledEvent{
    subject: EventTypes.FacilityReservationCancelled;
    data: {
        id: string;
        version: number;
        ticket: {
            id: string;
        }
    }
}