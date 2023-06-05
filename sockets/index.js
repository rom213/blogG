/**
 * @swagger
 * components:
 *   schemas:
 *     NewPostPayload:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del post
 *       required:
 *         - id
 */

/**
 * @swagger
 * tags:
 *   name: Sockets
 *   description: Manejo de eventos de sockets
 */

/**
 * @swagger
 * /api/sockets/new-post:
 *   post:
 *     summary: Emitir un nuevo post a través de sockets
 *     tags: [Sockets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewPostPayload'
 *     responses:
 *       '200':
 *         description: Post emitido exitosamente a través de sockets
 *       '500':
 *         description: Error interno del servidor
 */

const postService = require('../servises/post.servise.js');

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    this.io.on('connection', (socket) => {
      console.log('Cliente conectado');

      socket.on('new-post', async ({ id }) => {
        try {
          const post = await postService.findPost(id);
          const newPost = await postService.downloadImgsPost(post);
          socket.broadcast.emit('render-new-post', newPost);
        } catch (error) {
          console.log(error);
        }
      });
    });
  }
}

module.exports = Sockets;
