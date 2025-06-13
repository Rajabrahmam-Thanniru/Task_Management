import { Router } from "express";
import { Dashboard } from "../../controllers/admin/Dashboard";

const router = Router();

router.get("/dashboard/:userId", Dashboard);

export default router;
