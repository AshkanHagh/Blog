import { Router } from 'express';
import { addPost, getPosts, getSinglePost, likePost, searchPost } from '../controller/post.controller';
import protectRoute from '../middlewares/protectRoute'; // middleware for check jwt token and set req.user

const router = Router();

router.post('/add', protectRoute, addPost); // route for add a new Post

router.get('/', getPosts); // route for get all posts

router.get('/:id', getSinglePost); // route for get single post with id

router.get('/search/:query', protectRoute, searchPost); // route for search for post with title

router.put('/like/:id', protectRoute, likePost); // route for like a post


export default router;