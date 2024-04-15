import { Router } from "express";
import { signup, signin, logout }  from "../controllers/sign_controller";
import { getToken } from '../utils/middlewares/management/getToken';
import { getRole } from '../utils/middlewares/management/getRole';

const router = Router();



router.get('/signin', getToken, getRole, signin);
router.post('/signin', getToken, getRole, signin);

router.get('/signup', getToken, getRole, signup);
router.post('/signup', getToken, getRole, signup);


router.post('/logout', logout);

export default router;