import { Router } from 'express';
import protectRoute from '../middlewares/protectRoute';
import { addComment, deleteComment, editComment, getComments, getReplays, replay } from '../controller/comment.controller';

const router = Router();

router.post('/:id', protectRoute, addComment);

router.delete('/:id', protectRoute, deleteComment);

router.get('/:id', getComments);

router.put('/:id', protectRoute, editComment);

router.post('/replay/:id', protectRoute, replay);

router.get('/replay/:id', protectRoute, getReplays);



export default router;