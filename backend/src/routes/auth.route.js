import express from 'express';
import { signup, login, logout , updateProfile , checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.protectRoute.js';

const router = express.Router();

router.post('/signup',signup);

router.post('/login',login);

router.post('/logout', logout);

router.put("/update-profile", protectRoute ,updateProfile);//protectRoute is a middleware function that will be created in the next section.

router.get('/check', protectRoute, checkAuth);

export default router;