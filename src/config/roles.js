const allRoles = {
  superAdmin: [
    'fullAccess'
  ],
  admin: [
    'getUsers',
    'createUsers',
    'managePosts',
    'deleteAnyPost',
    'suspendPost',
    'manageComments',
    'deleteAnyComment',
  ],
  moderator: [
    'managePosts',
    'createPost',
    'deletePost',
    'updatePost',
    'deleteComment',
    'updateComment',
    'manageUsers',
  ],
  user: [
    'createPost',
    'readPost',
    'updateOwnPost',
    'deleteOwnPost',
    'createComment',
    'updateOwnComment',
    'deleteOwnComment',
    'likePost',
    'dislikePost',
    'manageUsers'
  ]
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
