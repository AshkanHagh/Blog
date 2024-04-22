import { Router } from 'express';
import protectRoute from '../middlewares/protectRoute';
import { deletePost, updatePost, whoIsLiked } from '../controller/publish.controller';

const router = Router();

router.put('/:id', protectRoute, updatePost);

router.delete('/:id', protectRoute, deletePost);

router.get('/whoLiked/:id', whoIsLiked);


export default router;