import { currentUser, requireAuth, validateRequest } from '@dfacilitiesorg/common';
import { body } from 'express-validator';
import express, {Request, Response} from 'express';
import { Facility } from '../models/facility';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/facilities',
    currentUser,
    requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage("Title of the facility is required"),
        body('price')
            .isFloat({gt: 0})
            .withMessage("Price of facility must be greater than 0"),
        body('quantity')
            .isNumeric()
            .custom((value) => value > 0)
            .withMessage("Number of available facility bookings must be provided")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {title, price, quantity} = req.body;
        var facilityTickets = [];

        for(var i = 1; i <= quantity; i++){
            // create a new ticket for that facility title (each ticket will have a unique id)
            const facilityTicket = Facility.build({
                title, 
                price, 
                userId: req.currentUser!.id
            });

            await facilityTicket.save();
            
            facilityTickets.push(facilityTicket);

            //TODO: Publish an event for ticket being published
            await new TicketCreatedPublisher(natsWrapper.client).publish({
                id: facilityTicket.id,
                title: facilityTicket.title,
                price: facilityTicket.price,
                userId: facilityTicket.userId,
                version: facilityTicket.version
            });
        }

        res.status(201).send(facilityTickets);
    }    
)

export {router as createFacilityTicketRouter};