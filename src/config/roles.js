// const allRoles = {
//   superAdmin: [],
//   admin: ['getUsers', 'createUsers'],
//   user: [],
// };

// const roles = Object.keys(allRoles);
// const roleRights = new Map(Object.entries(allRoles));

// module.exports = {
//   roles,
//   roleRights,
// };

const allRoles = {
  superAdmin: ['getUsers', 'createUsers', 'deleteUsers', 'promoteUsers', 'manageAllPosts', 'deleteAnyPost', 'restoreUsers'],
  admin: ['getUsers', 'createUsers', 'managePosts', 'deleteAnyPost', 'suspendPost'],
  moderator: ['managePosts', 'deletePost', 'updatePost', 'deleteComment', 'updateComment'],
  user: ['createPost', 'readPost', 'updateOwnPost', 'deleteOwnPost', 'createComment', 'updateOwnComment', 'deleteOwnComment', 'likePost', 'dislikePost', 'manageProfile'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
