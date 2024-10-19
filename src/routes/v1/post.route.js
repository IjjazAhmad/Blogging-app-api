const express = require('express');
const validate = require('../../middlewares/validate');
const { postValidation } = require('../../validations');
const { postController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();
router
    .route('/')
    .get(auth('get'), postController.getAllPosts);
router
    .route('/create')
    .post(auth(), validate(postValidation.createPost), postController.createPost);
router
    .route('/getOwnPosts')
    .get(postController.getOwnPosts);

router
    .route('/:postId')
    .put(validate(postValidation.updatePost), postController.updatePost)
    .delete(auth("deleteOwnPost"), validate(postValidation.deletePost), postController.deleteOwnPost)
    .get(postController.getPost);

module.exports = router;
