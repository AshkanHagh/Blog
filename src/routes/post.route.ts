import { Router } from 'express';
import { addPost, getPosts, getSinglePost, likePost, searchPost } from '../controller/post.controller';
import protectRoute from '../middlewares/protectRoute';

const router = Router();

router.post('/add', protectRoute, addPost);

router.get('/', getPosts);

router.get('/:id', getSinglePost);

router.get('/search/:query', protectRoute, searchPost);

router.put('/like/:id', protectRoute, likePost);


export default router;