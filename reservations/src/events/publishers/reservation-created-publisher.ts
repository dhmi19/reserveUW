import { Publisher, FacilityReservationCreatedEvent, EventTypes } from "@dfacilitiesorg/common";

export class ReservationCreatedPublisher extends Publisher<FacilityReservationCreatedEvent>{
    subject: EventTypes.FacilityReservationCreated = EventTypes.FacilityReservationCreated;
}