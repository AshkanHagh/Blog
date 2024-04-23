import { Router } from 'express';

import { profile, login, logout, signup, updateProfile, searchUser, freezeAccount, follow, followers, followings, 
getMyPosts} from '../controller/user.controller';

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

router.get('/followers/:id', followers);

router.get('/followings/:id', followings);

router.get('/posts', protectRoute, getMyPosts);


export default router;