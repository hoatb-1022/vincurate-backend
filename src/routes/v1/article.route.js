const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { articleValidation } = require('../../validations');
const { articleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageArticles'), validate(articleValidation.createArticle), articleController.createArticle)
  .get(validate(articleValidation.getArticles), articleController.getArticles);

router.get('/:articleId/next', validate(articleValidation.getArticle), articleController.getNextArticle);
router.get(
  '/:articleId/labeling-suggestions',
  auth('manageArticles'),
  validate(articleValidation.getArticle),
  articleController.getArticleLabelingSuggestions
);
router.get('/:articleId/export', validate(articleValidation.getArticle), articleController.exportArticle);
router.patch(
  '/:articleId/update-annotations',
  auth('manageArticles'),
  validate(articleValidation.updateArticleAnnotations),
  articleController.updateArticleAnnotations
);
router.patch(
  '/:articleId/update-categories',
  auth('manageArticles'),
  validate(articleValidation.updateArticleCategories),
  articleController.updateArticleCategories
);
router.patch(
  '/:articleId/update-translation',
  auth('manageArticles'),
  validate(articleValidation.updateArticleTranslation),
  articleController.updateArticleTranslation
);
router.post(
  '/:articleId/create-seq-label-version',
  auth('manageSeqLabelVersions'),
  validate(articleValidation.createArticleSeqLabelVersion),
  articleController.createArticleSeqLabelVersion
);
router.post(
  '/:articleId/create-category-version',
  auth('manageCategoryVersions'),
  validate(articleValidation.createArticleCategoryVersion),
  articleController.createArticleCategoryVersion
);
router.post(
  '/:articleId/create-translation-version',
  auth('manageTranslationVersions'),
  validate(articleValidation.createArticleTranslationVersion),
  articleController.createArticleTranslationVersion
);
router.route('/upload').post(auth('uploadFile'), validate(articleValidation.uploadFile), articleController.uploadFile);
router
  .route('/:articleId')
  .get(validate(articleValidation.getArticle), articleController.getArticle)
  .patch(auth('manageArticles'), validate(articleValidation.updateArticle), articleController.updateArticle)
  .delete(auth('manageArticles'), validate(articleValidation.deleteArticle), articleController.deleteArticle);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management and retrieval
 */

/**
 * @swagger
 * path:
 *  /articles/uploadFile:
 *    post:
 *      summary: Create new article from file
 *      description: Only user can upload file
 *      tags: [Articles]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: User id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 */
