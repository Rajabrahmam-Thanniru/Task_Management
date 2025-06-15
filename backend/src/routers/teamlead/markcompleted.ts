// src/routers/teamlead/markcompleted.ts
import express from 'express';
import { markcompleted } from '../../controllers/teamLead/markcompleted';

const router = express.Router();
router.put('/markcompleted', markcompleted);

export default router;
