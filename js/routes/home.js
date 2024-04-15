"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_controller_1 = require("../controllers/home_controller");
const getToken_1 = require("../utils/middlewares/management/getToken");
const getRole_1 = require("../utils/middlewares/management/getRole");
const router = (0, express_1.Router)();
router.get("/", getToken_1.getToken, getRole_1.getRole, home_controller_1.home);
exports.default = router;
