import express from "express";

// CONTROLER
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import authController from "../controllers/authController";
// import checkAuthorization from "../../../authorization-service";

// ROUTER
const router = express.Router();

// Routes pour accéder aux trajets
router.get('/', homeController.displayHome);
router.get('/users', userController.displayUsers);
router.get('/users/:email', userController.displayUser);

router.get('/login', authController.displayLogin);
router.post('/login', authController.login);
router.get('/register', authController.displayRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

export default router;