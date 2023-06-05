const Post = require("../models/post.model");
const PostImg = require("../models/postImg.model");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const { storage } = require("../utils/firebase");
const { ref, getDownloadURL } = require('firebase/storage');

exports.findPost= async(id)=>{
    const post = await Post.findAll({
        where: {
          id,
          status: 'active',
        },
        attributes: {
          exclude: ['userId', 'status'],
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl', 'description'],
          },
          {
            model: PostImg,
          },
        ],
        order: [['createdAt', 'DESC']], //ASC = ascendente; DESC = descendente
        limit: 20,
      });

      if (!post) {
        throw new AppError(`post whit id:${id} not found `,404)
      }

      return post
}

exports.dowloadImgsPost= async(post)=>{
    exports.downloadImgsPost = async (post) => {
        const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
        const urlProfileUser = await getDownloadURL(imgRefUserProfile);
      
        post.user.profileImgUrl = urlProfileUser;
      
        const postImgsPromises = post.postImgs.map(async (postImg) => {
          const imgRef = ref(storage, postImg.postImgUrl);
          const url = await getDownloadURL(imgRef);
      
          postImg.postImgUrl = url;
          return postImg;
        });
      
        await Promise.all(postImgsPromises);
      
        return post;
      };
}