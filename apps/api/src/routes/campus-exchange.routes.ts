import { Router } from 'express';
import { CampusExchangeController } from '../controllers/campus-exchange.controller';

const router = Router();

router.get('/items', CampusExchangeController.getItems);
router.post('/report', CampusExchangeController.reportItem);
router.post('/claim/:id', CampusExchangeController.claimItem);

export default router;
