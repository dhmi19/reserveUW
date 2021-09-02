import { Publisher, EventTypes, TicketCreatedEvent } from "@dfacilitiesorg/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: EventTypes.FacilityTicketCreated = EventTypes.FacilityTicketCreated;
}