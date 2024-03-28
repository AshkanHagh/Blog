const { body } = require('express-validator');
const router = require('express').Router();

const isAuth = require('../middlewares/verify-token');

const postController = require('../controllers/post');


router.get('/', postController.getAllPosts);

router.get('/:id', postController.getSinglePost);

router.post('/comment/:id', body('comment').trim().notEmpty(), isAuth, postController.addNewComment);

router.put('/like/:id', isAuth, postController.likePost);

router.put('/dislike/:id', isAuth, postController.dislike);


module.exports = router;