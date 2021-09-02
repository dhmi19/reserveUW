import { Message } from "node-nats-streaming";
import { EventTypes, Listener, TicketUpdatedEvent } from "@dfacilitiesorg/common";
import { FacilityTicket } from "../../models/facility";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: EventTypes.FacilityTicketUpdated = EventTypes.FacilityTicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const ticket = await FacilityTicket.findByEvent(data);

        if(!ticket) throw new Error("Facility ticket not found");

        const {title, price} = data;
        ticket.set({title, price});
        await ticket.save();
        msg.ack();
    }
}