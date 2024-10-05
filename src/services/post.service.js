const httpStatus = require('http-status');
const { Post } = require('../models');
const ApiError = require('../utils/ApiError');
const { documentStatus } = require('../utils/constants');


const createPost = async (postBody) => {
    const post = new Post(postBody);
    return post.save();
};
const queryPost = async (filter, options) => Post.paginate(filter, options);
const getPostById = async (id) => {
    return Post.findById(id);
};

const updatePostById = async (postId, updateBody) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }

    if (updateBody.author && updateBody.author !== post.author.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this post');
    }

    Object.assign(post, updateBody);
    await post.save();
    return post;
};

const getPostsByUserId = async (userId) => {
    const posts = await Post.find({ author: userId, status: documentStatus.PUBLISHED });
    return posts;
};
const deletePostById = async (postId) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    await post.remove();
    return post;
};
const deleteOwnPost = async (postId, userId) => {
    const post = await Post.findOneAndUpdate(
        { _id: postId, author: userId, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );
    if (!post) {
        throw new Error('Post not found or already deleted');
    }
    return post;
};


module.exports = {
    createPost,
    getPostById,
    updatePostById,
    deletePostById,
    getPostsByUserId,
    deleteOwnPost,
    queryPost,
};
