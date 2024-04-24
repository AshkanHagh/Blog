import { Router } from 'express';

import { profile, login, logout, signup, updateProfile, searchUser, freezeAccount, follow, followers, followings, 
getMyPosts} from '../controller/user.controller';

import protectRoute from '../middlewares/protectRoute'; // middleware for check jwt token and set req.user

const router = Router();

router.post('/signup', signup); // route for signup

router.post('/login', login); // route for login

router.post('/logout', logout); // route for logout

router.get('/profile', protectRoute, profile); // route for get profile

router.put('/update/:id', protectRoute, updateProfile); // route for update your profile

router.get('/search/:query', searchUser); // route for search to get others profile

router.put('/freeze', protectRoute, freezeAccount); // route for freeze your account

router.put('/follow/:id', protectRoute, follow); // route for follow or unFollow others

router.get('/followers/:id', followers); // route for get who is follow me

router.get('/followings/:id', followings); // route for get who i follow

router.get('/posts', protectRoute, getMyPosts); // route for getAllMyPosts & isPublish or not Publish


export default router;