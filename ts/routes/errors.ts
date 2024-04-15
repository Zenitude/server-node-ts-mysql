import { Router } from 'express';
import { errors } from "../controllers/errors_controller";
import { getToken } from '../utils/middlewares/management/getToken';
import { getRole } from '../utils/middlewares/management/getRole';
const router = Router();

router.use(getToken, getRole, errors)

export default router;