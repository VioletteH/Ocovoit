import express from "express";

// CONTROLER
import homeController from "../controllers/homeController";
import adminController from "../controllers/adminController";
import userController from "../controllers/userController";
import authController from "../controllers/authController";

import { verifyToken } from '../middlewares/verifyToken';
import { verifyRole } from '../middlewares/verifyRole';
import { routeAuthz } from '../middlewares/routeAuthz';

// ROUTER
const router = express.Router();

// Routes pour accéder aux trajets
router.get('/', homeController.displayHome);
router.get('/users', routeAuthz, userController.displayUsers);
router.get('/users/:email', routeAuthz, userController.displayUser);

router.get('/login', authController.displayLogin);
router.post('/login', authController.login);
router.get('/register', authController.displayRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

export default router;