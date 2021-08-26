import { BadRequestError, currentUser, NotAuthorizedError, requireAuth} from '@dfacilitiesorg/common';
import { body } from 'express-validator';
import express, {Request, Response} from 'express';
import { Facility } from '../models/facility';

const router = express.Router();

router.delete(
    '/api/facilities/:id',
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
      
        const facilityTicket = await Facility.findById(req.params.id);
        
        // Check if facility ticket with that id exists
        if(!facilityTicket) throw new BadRequestError("No facility ticket found with provided id");
        
        // check if the loggedin user created the ticket
        if(facilityTicket.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();
        }

        //delete the ticket
        facilityTicket.delete();
        
        //TODO: Publish an event that a Facility Ticket was deleted

        res.send(facilityTicket);
    }    
)

export {router as deleteFacilityTicketRouter};