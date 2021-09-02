import { BadRequestError, currentUser, NotFoundError, requireAuth, validateRequest } from '@dfacilitiesorg/common';
import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { FacilityTicket } from '../models/facility';
import { FacilityReservation } from '../models/reservation';
import { ReservationStatus } from '@dfacilitiesorg/common';
import { ReservationCreatedPublisher } from '../events/publishers/reservation-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();


router.post(
    '/api/reservations',
    currentUser,
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("ticketId must be provided")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const {ticketId} = req.body;
        
        // Find the ticket the user is trying to order in the database
        const facilityTicket = await FacilityTicket.findById(ticketId);
        if(!facilityTicket) throw new NotFoundError();

        //TODO: make sure the facilityTicket is not already reserved
        const isReserved = await facilityTicket.isReserved();
        if(isReserved) throw new BadRequestError("That facility ticket is already reserved");

        const reservation = FacilityReservation.build({
            userID: req.currentUser!.id,
            status: ReservationStatus.Created,
            ticket: facilityTicket
        });
        await reservation.save();

        // TODO: Publish an event for new reservation
        new ReservationCreatedPublisher(natsWrapper.client).publish({
            id: reservation.id,
            status: reservation.status,
            userId: reservation.userID,
            version: reservation.version,
            ticket: {
                id: facilityTicket.id,
                price: facilityTicket.price
            }
        });
        res.status(201).send(reservation);
    }

)


export {router as newReservationRouter};