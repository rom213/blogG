const express = require('express');

//controllers
const postController = require('../controllers/post.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationsMiddleware = require('../middlewares/validations.middleware');
const userMiddleware = require('./../middlewares/user.middleware');
const postMiddleware = require('./../middlewares/post.middleware');

//utils
const { upload } = require('./../utils/multer');

const router = express.Router();

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*   schemas:
*     Post:
*       type: object
*       properties:
*         title:
*           type: string
*           description: post title
*         content:
*           type: string
*           description: content post
*       required:
*         - title
*         - content
*       example:
*         title: la tecnologia avanza
*         content: la tecnologia esta avanzando constantemente y este es el contenido del post
*/




router
  .route('/')
/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *      summary: return all posts
 *      tags: [Post]
 *      responses:
 *        200:
 *          description: all posts
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Post'   
 * 
*/

  .get(postController.findAllPost)
/**
   * @swagger
   * /api/v1/posts:
   *  post:
   *    summary: create a new post
   *    tags: [Post]
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        multipart/form-data:
   *          schema:
   *            type: object
   *            properties:
   *              title:
   *                type: string
   *              content:
   *                type: string
   *              postImgs:
   *                type: array
   *                items:
   *                  type: string
   *                  format: binary
   *            required:
   *              - title
   *              - content
   *    responses:
   *      201:
   *        description: new user created!
   */
  .post(
    authMiddleware.protect,
    upload.array('postImgs', 3),
    validationsMiddleware.createPostValidation,
    postController.createPost
  );

router.use(authMiddleware.protect);
/** 
 * @swagger
 * /api/v1/posts/me:
 *  get:
 *    summary: return all my posts
 *    tags: [Post]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *       200:
 *         description: all my posts
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Post' 
*/
router.get('/me', postController.findMyPosts);
/** 
 * @swagger
 * /api/v1/posts/{id}:
 *  get:
 *    summary: return one my posts
 *    tags: [Post]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the post id
 *    responses:
 *       200:
 *         description: one my posts
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Post' 
*/

router.get(
  '/profile/:id',
  userMiddleware.validIfExistUser,
  postController.findUserPost
);

/** 
 * @swagger
 * /api/v1/posts/{id}:
 *  get:
 *    summary: return one post
 *    tags: [Post]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the post id
 *    responses:
 *       200:
 *         description: one post
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Post' 
*/

router
  .route('/:id')
  .get(postMiddleware.existsPostForFoundIt, postController.findOnePost)
   /** 
   * @swagger
   * /api/v1/posts/{id}:
   *  patch:
   *    summary: update a post
   *    tags: [Post]
   *    security:
   *       - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: the post id
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            $ref: '#/components/schemas/Post'
   *    responses:
   *      200:
   *        description: user updated!
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              $ref: '#/components/schemas/Post'
   *      404:
   *        description: post not found
   *
   */
  .patch(
    validationsMiddleware.createPostValidation,
    postMiddleware.validIfExistPost,
    authMiddleware.protectAccountOwner,
    postController.updatePost
  )
  /**
   * @swagger
   * /api/v1/posts/{id}:
   *  delete:
   *    summary: delete my post
   *    tags: [Post]
   *    security:
   *       - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: the post id
   *    responses:
   *      200:
   *        description: post deleted!
   *      404:
   *        description: error post not found
   *
   */ 
  .delete(
    postMiddleware.validIfExistPost,
    authMiddleware.protectAccountOwner,
    postController.deletePost
  );

module.exports = router;
