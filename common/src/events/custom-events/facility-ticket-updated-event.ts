import { EventTypes } from "../event-types";

export interface TicketUpdatedEvent {
    subject: EventTypes.FacilityTicketUpdated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
    }
}