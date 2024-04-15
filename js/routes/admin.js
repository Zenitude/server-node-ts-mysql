"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin_controller");
const getToken_1 = require("../utils/middlewares/management/getToken");
const getRole_1 = require("../utils/middlewares/management/getRole");
const router = (0, express_1.Router)();
router.get("/admin", getToken_1.getToken, getRole_1.getRole, admin_controller_1.dashboard);
exports.default = router;
