"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact_controller");
const getToken_1 = require("../utils/middlewares/management/getToken");
const getRole_1 = require("../utils/middlewares/management/getRole");
const router = (0, express_1.Router)();
router.get("/contact", getToken_1.getToken, getRole_1.getRole, contact_controller_1.contact);
exports.default = router;
