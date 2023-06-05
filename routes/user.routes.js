const express = require('express');

//controllers
const userController = require('./../controllers/user.controller');
const authController = require('./../controllers/auth.controller');

//middlewares
const userMiddleware = require('./../middlewares/user.middleware');
const validationMiddleware = require('./../middlewares/validations.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');

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
*     User:
*       type: object
*       properties:
*         name:
*           type: string
*           description: user name
*         email:
*           type: string
*           description: your email
*         description: 
*           type: string   
*         password:
*            type: string
*            description: your password
*         required:
*           - name
*           - email
*           - description
*           - password
*         example:
*           name: benito
*           email: benito@correo.com
*           password: 123456789
*           description: i like dogs
*/




router.use(authMiddleware.protect);
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *      summary: return all users
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: all users
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'   
 * 
*/

router.get('/', userController.findAll);

router
  .route('/:id')
  /** 
 * @swagger
 * /api/v1/users/{id}:
 *  get:
 *    summary: return one user
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the user id
 *    responses:
 *       200:
 *         description: one user
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User' 
*/
  .get(userMiddleware.validIfExistUser, userController.findOne)
   /** 
   * @swagger
   * /api/v1/users/{id}:
   *  patch:
   *    summary: update my user
   *    tags: [User]
   *    security:
   *       - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: the user id
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              email:
   *                type: string
   *    responses:
   *      200:
   *        description: user updated!
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                email:
   *                  type: string
   *      404:
   *        description: user not found
   *
   */
  .patch(
    userMiddleware.validIfExistUser,
    validationMiddleware.updateUserValidation,
    authMiddleware.protectAccountOwner,
    userController.update
  )

  /**
   * @swagger
   * /api/v1/users/{id}:
   *  delete:
   *    summary: delete my user 
   *    tags: [User]
   *    security:
   *       - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: my id user
   *    responses:
   *      200:
   *        description: post deleted!
   *      403:
   *        description: You do not have permission to perform this action!
   *      404:
   *        description: user not found
   */ 
  
  .delete(
    userMiddleware.validIfExistUser,
    authMiddleware.protectAccountOwner,
    // authMiddleware.restrictTo('admin'),
    userController.delete
  );

      /** 
   * @swagger
   * /api/v1/users/password/{id}:
   *  patch:
   *    summary: update password
   *    tags: [User]
   *    security:
   *       - bearerAuth: []
  *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: my id user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              currentPassword:
   *                type: string
   *              newPassword:
   *                type: string
   *            require: 
   *              - currentPassword
   *              - newPassword
   *    responses:
   *      200:
   *        description: user updated!
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                password:
   *                  type: string
   *      404:
   *        description: post not found
   *
   */

router.patch(
  '/password/:id',
  validationMiddleware.updatedPasswordValidation,
  userMiddleware.validIfExistUser,
  authMiddleware.protectAccountOwner,
  authController.updatedPassword
);

module.exports = router;
