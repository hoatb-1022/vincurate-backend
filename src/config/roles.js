const roles = ['user', 'admin'];

const userRights = [
  'uploadFile',
  'getUsers',
  'manageArticles',
  'manageProjects',
  'getProjects',
  'manageSeqLabelVersions',
  'manageCategoryVersions',
  'manageLabels',
  'manageCategories',
];
const adminRights = [...userRights, 'manageUsers'];

const roleRights = new Map();
roleRights.set(roles[0], userRights);
roleRights.set(roles[1], adminRights);

module.exports = {
  roles,
  roleRights
};
