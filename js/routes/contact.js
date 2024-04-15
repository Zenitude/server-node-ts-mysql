"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact_controller");
const getToken_1 = require("../utils/middlewares/management/getToken");
const getRole_1 = require("../utils/middlewares/management/getRole");
const getMessageById_1 = require("../utils/middlewares/management/getMessageById");
const router = (0, express_1.Router)();
router.get("/contact", getToken_1.getToken, getRole_1.getRole, contact_controller_1.contact);
router.post("/contact", getToken_1.getToken, getRole_1.getRole, contact_controller_1.contact);
/* Read */
router.get("/messages", getToken_1.getToken, getRole_1.getRole, contact_controller_1.list);
router.get("/messages/:id", getToken_1.getToken, getRole_1.getRole, getMessageById_1.getMessageById, contact_controller_1.details);
/* Delete */
router.get("/messages/:id/delete", getToken_1.getToken, getRole_1.getRole, getMessageById_1.getMessageById, contact_controller_1.remove);
router.delete("/messages/:id/delete", getToken_1.getToken, getRole_1.getRole, contact_controller_1.remove);
exports.default = router;
