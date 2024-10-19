const allRoles = {
  superAdmin: [
    'fullAccess'
  ],
  admin: {
    post: ['get', 'add', 'update', 'delete'],
  },
  moderator: {
    post: ['get', 'add', 'update', 'delete'],
  },
  user: {
    post: ['get', 'add', 'update', 'delete'],
  }
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
