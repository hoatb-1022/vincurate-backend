const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const articleRoute = require('./article.route');
const labelRoute = require('./label.route');
const labelSetRoute = require('./label-set.route');
const categoryRoute = require('./category.route');
const projectRoute = require('./project.route');
const seqLabelVersionRoute = require('./seq-label-version.route');
const categoryVersionRoute = require('./category-version.route');
const translationVersionRoute = require('./translation-version.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/articles',
    route: articleRoute,
  },
  {
    path: '/labels',
    route: labelRoute,
  },
  {
    path: '/label-sets',
    route: labelSetRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/projects',
    route: projectRoute,
  },
  {
    path: '/seq-label-versions',
    route: seqLabelVersionRoute,
  },
  {
    path: '/category-versions',
    route: categoryVersionRoute,
  },
  {
    path: '/translation-versions',
    route: translationVersionRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
