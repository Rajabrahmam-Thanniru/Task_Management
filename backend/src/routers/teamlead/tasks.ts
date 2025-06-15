import express from 'express';
import { tasks } from '../../controllers/teamLead/tasks';

const router = express.Router();

router.get('/tasks/:userId', tasks);

export default router;