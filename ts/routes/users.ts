import { Router } from 'express';
import { list, details, create, update, remove } from "../controllers/users_controller";
import { getToken } from '../utils/middlewares/management/getToken';
import { getRole } from '../utils/middlewares/management/getRole';
import { getUserById } from '../utils/middlewares/management/getUserById';
const router = Router();

/* Create */
router.get("/users/create", getToken, getRole, create);
router.post("/users/create", getToken, getRole, create);

/* Read */
router.get("/users", getToken, getRole, list);
router.get("/users/:id", getToken, getRole, getUserById, details);

/* Update */
router.get("/users/:id/update", getToken, getRole, getUserById, update);
router.put("/users/:id/update", getToken, getRole, update);

/* Delete */
router.get("/users/:id/delete", getToken, getRole, getUserById, remove);
router.delete("/users/:id/delete", getToken, getRole, getUserById, remove);

export default router;