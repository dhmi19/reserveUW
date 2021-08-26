import { BadRequestError, currentUser, NotAuthorizedError, requireAuth, validateRequest } from '@dfacilitiesorg/common';
import { body } from 'express-validator';
import express, {Request, Response} from 'express';
import { Facility } from '../models/facility';

const router = express.Router();

router.put(
    '/api/facilities/:id',
    currentUser,
    requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage("Title of the facility is required"),
        body('price')
            .isFloat({gt: 0})
            .withMessage("Price of facility must be greater than 0")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {title, price} = req.body;
        
        const facilityTicket = await Facility.findById(req.params.id);
        
        // Check if facility ticket with that id exists
        if(!facilityTicket) throw new BadRequestError("No facility ticket found with provided id");
        
        // check if the loggedin user created the ticket
        if(facilityTicket.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();
        }

        // Update the ticket
        facilityTicket.set({title, price});
        facilityTicket.save();

        //TODO: Publish an event that a Facility Ticket was updated

        res.send(facilityTicket);
    }    
)

export {router as updateFacilityTicketRouter};