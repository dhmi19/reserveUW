import { Publisher, EventTypes, TicketUpdatedEvent } from "@dfacilitiesorg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: EventTypes.FacilityTicketUpdated = EventTypes.FacilityTicketUpdated;
}
