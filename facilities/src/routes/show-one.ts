import express, {Request, Response} from 'express';
import { Facility } from '../models/facility';
import { NotFoundError } from '@dfacilitiesorg/common';

const router = express.Router();

router.get('/api/facilities/:id', async (req: Request, res: Response) => {
    const facilityTicket = await Facility.findById(req.params.id);

    if(!facilityTicket){
        throw new NotFoundError();
    }
 
    res.send(facilityTicket);
});

export {router as showOneTicketRouter};