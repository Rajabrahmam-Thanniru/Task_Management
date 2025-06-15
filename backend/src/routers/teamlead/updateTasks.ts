import express from 'express';
import { updateTasks } from '../../controllers/teamLead/updateTasks';

const router = express.Router();

router.put('/updatetasks', updateTasks);

export default router;