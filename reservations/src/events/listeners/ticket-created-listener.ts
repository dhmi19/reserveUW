import { Message } from "node-nats-streaming";
import { EventTypes, Listener, TicketCreatedEvent } from "@dfacilitiesorg/common";
import { FacilityTicket } from "../../models/facility";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = EventTypes.FacilityTicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message){
        console.log("Creating a new ticket in reservations service");
        const {id, title, price} = data;
        const facilityTicket = FacilityTicket.build({id, title, price});
        await facilityTicket.save();

        msg.ack();
    }
}