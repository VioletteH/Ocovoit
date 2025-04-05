import express from "express";

import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import authController from "../controllers/authController";

import { routeAuthz } from '../middlewares/routeAuthz';

const router = express.Router();

router.get('/', homeController.displayHome);

router.get('/users', routeAuthz, userController.displayUsers);

router.get('/login', authController.displayLogin);
router.post('/login', authController.login);
router.get('/register', authController.displayRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

export default router;