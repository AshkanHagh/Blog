import { Router } from 'express';
import protectRoute from '../middlewares/protectRoute'; // middleware for check jwt token and set req.user
import { addComment, deleteComment, editComment, getComments, getReplays, likeComment, replay } from '../controller/comment.controller';

const router = Router();

router.post('/:id', protectRoute, addComment); // route for add a new comment

router.delete('/:id', protectRoute, deleteComment); // route for delete a comment

router.get('/:id', getComments); // route for get all comments

router.put('/:id', protectRoute, editComment); // route for update a comment

router.post('/replay/:id', protectRoute, replay); // route for add a replay to comment

router.get('/replay/:id', protectRoute, getReplays); // route for get all replays

router.put('/like/:id', protectRoute, likeComment); // route for like a comment



export default router;