import express from "express";
import { sendTasks } from "../../controllers/teamLead/sendTasks";

const router = express.Router();

// POST route to retrieve task details for a specific project
router.get("/sendtasks", sendTasks);

export default router;
