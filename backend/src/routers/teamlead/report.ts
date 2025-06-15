import express from "express";
import { submitReport } from "../../controllers/teamLead/teamLeadReport";

const router = express.Router();

router.post("/report", submitReport);

export default router;
