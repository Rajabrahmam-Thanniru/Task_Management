import express from "express";

import { getTeamLeadsAndMembers } from "../controllers/GetTeamLeads";

const router = express.Router();

router.get("/teamleads", getTeamLeadsAndMembers);

export default router;