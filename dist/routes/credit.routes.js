"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const credit_controller_1 = require("../controllers/credit.controller");
const router = (0, express_1.Router)();
router.post('/credits', credit_controller_1.createCredit);
router.get('/credits/', credit_controller_1.getCredits);
router.get('/credits/:id', credit_controller_1.getCreditById);
router.put('/credits/:id', credit_controller_1.updateCredit);
router.delete('/credits/:id', credit_controller_1.deleteCredit);
// router.post('/credits/upload', createCreditWithImage ); // Add this line
// router for users
router.post('/users', credit_controller_1.createUser);
router.post('/login', credit_controller_1.loginUsers);
exports.default = router;
//# sourceMappingURL=credit.routes.js.map