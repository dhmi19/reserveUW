import { Publisher, FacilityReservationCancelledEvent, EventTypes } from "@dfacilitiesorg/common";

export class ReservationCancelledPublisher extends Publisher<FacilityReservationCancelledEvent>{
    subject: EventTypes.FacilityReservationCancelled = EventTypes.FacilityReservationCancelled;       
}