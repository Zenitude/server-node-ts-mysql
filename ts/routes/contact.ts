import { Router } from 'express';
import { contact } from "../controllers/contact_controller";
import { getToken } from '../utils/middlewares/management/getToken';
import { getRole } from '../utils/middlewares/management/getRole';
const router = Router();

router.get("/contact", getToken, getRole, contact);

export default router;