import { Router } from 'express';
import protectRoute from '../middlewares/protectRoute';
import { updatePost } from '../controller/publish.controller';

const router = Router();

router.put('/update/:id', protectRoute, updatePost);


export default router;