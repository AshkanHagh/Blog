import { Router } from 'express';
import { profile, login, logout, signup, updateProfile, searchUser, freezeAccount, follow } from '../controller/user.controller';
import protectRoute from '../middlewares/protectRoute';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.get('/profile', protectRoute, profile);

router.put('/update/:id', protectRoute, updateProfile);

router.get('/search/:query', searchUser);

router.put('/freeze', protectRoute, freezeAccount);

router.put('/follow/:id', protectRoute, follow);


export default router;