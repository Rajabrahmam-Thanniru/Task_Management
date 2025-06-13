import { Router } from "express";
import { AddTasks } from "../../controllers/admin/AddTasks";

const router = Router();

router.post("/addtasks", AddTasks);

export default router;