const { postService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createPost = async (req, res) => {
    const post = await postService.createPost(req.body);
    res.status(201).send(post);
};
const getAllPosts = catchAsync(async (req, res) => {
    const { limit = 10, page = 1 } = req.query;

    const filter = { isDeleted: { $ne: true } };
    const options = {
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
    };
    const posts = await postService.queryPost(filter, options);
    if (posts.totalResults === 0) {
        return res.status(httpStatus.NOT_FOUND).send({ message: 'No posts found' });
    }
    res.status(httpStatus.OK).send({
        totalPosts: posts.totalResults,
        totalPages: posts.totalPages,
        currentPage: posts.page,
        posts: posts.results,
    });
});
const updatePost = async (req, res) => {
    console.log(req.params.postId, req.body)
    const post = await postService.updatePostById(req.params.postId, req.body);
    res.send(post);
};

const deletePost = async (req, res) => {
    await postService.deletePostById(req.params.postId);
    res.status(204).send();
};

const getPost = async (req, res) => {
    const post = await postService.getPostById(req.params.postId);
    res.send(post);
};
const getOwnPosts = async (req, res) => {
    const userId = req.query.userId
    if (!userId) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'User ID is required' });
    }
    const posts = await postService.getPostsByUserId(userId);
    if (!posts.length) {
        return res.status(httpStatus.NOT_FOUND).send({ message: 'No posts found for this user' });
    }
    res.status(httpStatus.OK).send(posts);
};
const deleteOwnPost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;
    const deletedPost = await postService.deleteOwnPost(postId, userId);
    res.status(httpStatus.OK).send({
        message: 'Post deleted successfully',
        deletedPost
    });
};
module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getOwnPosts,
    getAllPosts,
    deleteOwnPost,
};
