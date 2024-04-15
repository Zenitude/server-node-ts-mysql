import { Router } from 'express';
import { dashboard } from "../controllers/admin_controller";
import { getToken } from '../utils/middlewares/management/getToken';
import { getRole } from '../utils/middlewares/management/getRole';
const router = Router();

router.get("/admin", getToken, getRole, dashboard);

export default router;