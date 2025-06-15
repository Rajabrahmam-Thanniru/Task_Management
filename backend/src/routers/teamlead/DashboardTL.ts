import express from 'express';
import { DashboardTL } from '../../controllers/teamLead/Dashboard';

const router = express.Router();

router.get('/dashboard/:userId', DashboardTL);

export default router;