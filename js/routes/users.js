"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users_controller");
const getToken_1 = require("../utils/middlewares/management/getToken");
const getRole_1 = require("../utils/middlewares/management/getRole");
const getUserById_1 = require("../utils/middlewares/management/getUserById");
const router = (0, express_1.Router)();
/* Create */
router.get("/users/create", getToken_1.getToken, getRole_1.getRole, users_controller_1.create);
router.post("/users/create", getToken_1.getToken, getRole_1.getRole, users_controller_1.create);
/* Read */
router.get("/users", getToken_1.getToken, getRole_1.getRole, users_controller_1.list);
router.get("/users/:id", getToken_1.getToken, getRole_1.getRole, getUserById_1.getUserById, users_controller_1.details);
/* Update */
router.get("/users/:id/update", getToken_1.getToken, getRole_1.getRole, getUserById_1.getUserById, users_controller_1.update);
router.put("/users/:id/update", getToken_1.getToken, getRole_1.getRole, getUserById_1.getUserById, users_controller_1.update);
/* Delete */
router.get("/users/:id/delete", getToken_1.getToken, getRole_1.getRole, getUserById_1.getUserById, users_controller_1.remove);
router.delete("/users/:id/delete", getToken_1.getToken, getRole_1.getRole, getUserById_1.getUserById, users_controller_1.remove);
exports.default = router;
