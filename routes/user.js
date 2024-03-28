const { body } = require('express-validator');
const router = require('express').Router();

const isAuth = require('../middlewares/verify-token');

const userController = require('../controllers/user');


router.get('/profile', isAuth, userController.getUserProfile);

router.get('/activity', isAuth, userController.userActivity);

router.put('/setting/password', [body('password').trim().isLength({min : 6}).notEmpty()], isAuth, userController.updatePassword);

router.put('/setting/', [body('username').trim().notEmpty(), body('email').trim().isEmail().notEmpty()], isAuth, userController.updateProfile);

router.post('/post', [body('title').trim().isLength({min : 7}).notEmpty(), body('info').trim().notEmpty(), 
body('description').trim().isLength({max : 255}).notEmpty()], isAuth, userController.createPost);


module.exports = router;