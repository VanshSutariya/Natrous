const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);
router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

router.route('/').get(userController.AllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
