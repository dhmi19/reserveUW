import { EventTypes } from "../event-types";

export interface TicketCreatedEvent {
    subject: EventTypes.FacilityTicketCreated
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
    }
}