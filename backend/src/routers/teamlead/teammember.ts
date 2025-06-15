import express from 'express';
import { teamMember } from '../../controllers/teamLead/teammember';

const router = express.Router();

router.get('/teammember/:userId', teamMember);

export default router;