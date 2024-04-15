import { Router } from 'express';
import { contact, list, details, remove } from "../controllers/contact_controller";
import { getToken } from '../utils/middlewares/management/getToken';
import { getRole } from '../utils/middlewares/management/getRole';
import { getMessageById } from '../utils/middlewares/management/getMessageById';
const router = Router();

router.get("/contact", getToken, getRole, contact);
router.post("/contact", getToken, getRole, contact);

/* Read */
router.get("/messages", getToken, getRole, list);
router.get("/messages/:id", getToken, getRole, getMessageById, details);

/* Delete */
router.get("/messages/:id/delete", getToken, getRole, getMessageById, remove);
router.delete("/messages/:id/delete", getToken, getRole, remove);

export default router;