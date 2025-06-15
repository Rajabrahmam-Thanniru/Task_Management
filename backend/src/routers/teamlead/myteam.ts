import express from 'express';
import { myTeam } from '../../controllers/teamLead/myteam';

const router = express.Router();
router.get('/myteam/:userId', myTeam);

export default router;