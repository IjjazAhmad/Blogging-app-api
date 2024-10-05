const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { documentStatus } = require('../utils/constants');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: false,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            default: documentStatus.PUBLISHED,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },

    },
    {
        timestamps: true,
    }
);

postSchema.plugin(toJSON);
postSchema.plugin(paginate);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
