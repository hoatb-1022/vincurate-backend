const roles = ['user', 'admin'];

const userRights = ['uploadFile', 'manageArticles'];
const adminRights = [...userRights, 'getUsers', 'manageUsers'];

const roleRights = new Map();
roleRights.set(roles[0], userRights);
roleRights.set(roles[1], adminRights);

module.exports = {
  roles,
  roleRights,
};
