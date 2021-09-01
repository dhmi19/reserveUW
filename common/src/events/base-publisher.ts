import { Stan } from "node-nats-streaming";
import { EventTypes } from "./event-types";

interface Event {
    subject: EventTypes;
    data: any;
}

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    private client: Stan;
    constructor(client: Stan) {
        this.client = client;
    }

    // Call this method to publish an event with data of type data from the event
    publish(data: T['data']): Promise<void>{
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if(err){
                    return reject(err);
                }
                console.log("Event published to subject", this.subject);
                resolve();
            });
        })
    }
}