import { currentUser, requireAuth, validateRequest } from '@dfacilitiesorg/common';
import { body } from 'express-validator';
import express, {Request, Response} from 'express';

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
        
    }    
)