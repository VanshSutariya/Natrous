const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// for above api's no need to require to login in
router.use(authController.protect);

router.route('/me').get(userController.getMe, userController.getUser);
router.route('/updatePassword').patch(authController.updatePassword);
router.route('/deleteMe').delete(userController.deleteMe);
router.route('/updateMe').patch(userController.updateMe);

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.AllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
