const { body } = require('express-validator');
const router = require('express').Router();

const isAuth = require('../middlewares/verify-token');

const postController = require('../controllers/post');
const commentController = require('../controllers/comment');


router.get('/', postController.getAllPosts);

router.get('/:id', postController.getSinglePost);

router.post('/comment/:id', body('comment').trim().notEmpty(), isAuth, postController.addNewComment);

router.put('/comment/:id', body('comment').trim().notEmpty(), isAuth, commentController.editComment);

router.delete('/comment/:id', isAuth, commentController.deleteComment);

router.put('/like/:id', isAuth, postController.likePost);

router.put('/dislike/:id', isAuth, postController.dislike);


module.exports = router;