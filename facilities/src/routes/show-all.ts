import express, {Request, Response} from 'express';
import { Facility } from '../models/facility';
import { BadRequestError, NotFoundError } from '@dfacilitiesorg/common';

const router = express.Router();

router.get('/api/facilities', async (req: Request, res: Response) => {
    
    try{
        const facilityTickets = await Facility.find();
        res.send(facilityTickets);
    } catch (err){
        throw new BadRequestError("Unable to get all facility tickets");
    }

});

export {router as showAllTicketRouter};