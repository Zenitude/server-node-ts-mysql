import { Router } from 'express';
import { home } from "../controllers/home_controller";
import { getToken } from '../utils/middlewares/management/getToken';
import { getRole } from '../utils/middlewares/management/getRole';
const router = Router();

router.get("/", getToken, getRole, home);

export default router;