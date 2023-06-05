const express = require('express');

//middlewares
const validations = require('./../middlewares/validations.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');
const { upload } = require('../utils/multer');

//controllers
const authController = require('../controllers/auth.controller');

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
 *    Auth:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description:  user name
 *        email:
 *          type: string
 *          description:  user email
 *        description:
 *          type: string
 *          description: user descriptison
 *        password:
 *          type: string
 *          description: user password
 *        role:
 *          type: string
 *          description: user role
 *        status:
 *          type: string
 *          description: user status
 *      required:
 *        - name
 *        - email
 *        - password
 *        - description
 *      example:
 *        name: nameUser
 *        email: example@gmail.com
 *        password: 123456
 *        description: programer
 */

/**
* @swagger
* /api/v1/auth/signup:
*  post:
*    summary: register user
*    tags: [Auth]
*    requestBody:
*      required: true
*      content:
*        multipart/form-data:
*          schema:
*            type: object
*            properties:
*              name:
*                type: string
*                description: user name
*              email:
*                type: string
*                description: user email
*              description:
*                type: string
*                description: user description
*              password:
*                type: string
*                description: user password
*              profileImgUrl:
*                type: string
*                format: binary
*                description: Profile img url
*                example: ''
              
*            required:
*              - name
*              - email
*              - description
*              - password
*              - profileImgUrl
*    responses:
*      201:
*        description: new user created
*/

/** 
 * @swagger
 * /api/v1/auth/login:
 *  post:
*    summary: login user
*    tags: [Auth]
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              email:
*                type: string
*                description: user email
*              password:
*                type: string
*                description: user password
*            required:
*              - email
*              - password
*    responses:
*      201:
*        description: user logged
*/


/**
 * @swagger
 * /api/v1/auth/renew:
 *    get:
 *      summary: renew token
 *      tags: [Auth]
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        200:
 *          description: token renewed 
 *        401:
 *          description: error de autenticacion
 */

router.post(
  '/signup',
  upload.single('profileImgUrl'),
  validations.createUserValidation,
  authController.signup
);

router.post('/login', validations.loginUserValidation, authController.login);

router.use(authMiddleware.protect);

router.get('/renew', authController.renew);

module.exports = router;
