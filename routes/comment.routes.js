const express = require('express');

//controllerss
const commentController = require('../controllers/comment.controller');

//middlewares
const authMiddleware = require('./../middlewares/auth.middleware');
const commentMiddleware = require('./../middlewares/comment.middleware');
const validationMiddleware = require('./../middlewares/validations.middleware');

const router = express.Router();

/** 
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *    Comment:
 *      type: object
 *      properties:
 *        text:
 *          type: string
 *          description: comment text
 *      required:
 *        - text
 *      example:
 *        text: este es el contenido del comentario
*/

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/v1/comments:
 *  get:
 *    summary: return all comments
 *    tags: [Comment]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: all comments
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Comment'
 */

router.get('/', commentController.findAllComments);

/**
 * @swagger
 * /api/v1/comments/{postId}:
 *  post:
 *    summary: create comment
 *    tags: [Comment]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: postId
 *        required: true
 *        description: id post
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *               description: comment text
 *           required:
 *             - text
 *          example:
 *            text: este es el contenido del comentario
 *    responses:
 *      201:
 *        description: comment created
 */

router.post('/:postId', commentController.createComment);

router
  .use('/:id', commentMiddleware.commentExist)
  .route('/:id')
  /** 
   * @swagger
   * /api/v1/comments/{id}:
   *  get:
   *    summary: return comment by id
   *    tags: [Comment]
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: id comment
   *        schema:
   *          type: string
   *    responses:
   *      200:
   *        description: comment by id
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Comment'   
   *
  */
  .get(commentController.findCommentById)
  /** 
   * @swagger
   * /api/v1/comments/{id}:
   *  patch:
   *    summary: update my comment
   *    tags: [Comment]
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: id comment
   *        schema:
   *          type: string
   *    requestBody:
   *      required: true
   *      content:
   *        application/json: 
   *          schema:
   *            type: object
   *            properties:
   *              text:
   *                type: string
   *                description: comment text
   *    responses:
   *      200:
   *        description: comment by id
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Comment'   
   *
  */
  .patch(
    validationMiddleware.validContentComment,
    commentController.updateComment
  )
/**
   * @swagger
   * /api/v1/comments/{id}:
   *  delete:
   *    summary: delete my comment
   *    tags: [Comment]
   *    security:
   *       - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: the comment id
   *    responses:
   *      200:
   *        description: comment deleted!
   *      404:
   *        description: error comment not found
   *
   */ 
  .delete(
    commentController.deleteComment
  );

module.exports = router;
