import { Router } from 'express';
import { addPost, getPosts, getSinglePost, searchPost } from '../controller/post.controller';
import protectRoute from '../middlewares/protectRoute';

const router = Router();

router.post('/add', protectRoute, addPost);

router.get('/', getPosts);

router.get('/:id', getSinglePost);

router.get('/search/:query', protectRoute, searchPost);


export default router;