import { Router } from 'express';
import protectRoute from '../middlewares/protectRoute'; // middleware for check jwt token and set req.user
import { deletePost, updatePost, whoIsLiked } from '../controller/publish.controller';

const router = Router();

router.put('/:id', protectRoute, updatePost);  // route for update or publish a post

router.delete('/:id', protectRoute, deletePost); // route for delete post

router.get('/whoLiked/:id', whoIsLiked); // route for get who is liked this post


export default router;