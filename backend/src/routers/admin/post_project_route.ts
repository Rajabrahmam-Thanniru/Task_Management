import express from 'express';
import { postproject } from '../../controllers/admin/postproject';

const router = express.Router();

router.post('/postproject', postproject);

export default router;