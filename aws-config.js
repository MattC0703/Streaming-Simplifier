//code by Matthew Culley

const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
// const AWS = require('aws-sdk');
const { S3Client } = require('@aws-sdk/client-s3');


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});


// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION
// });

//upload middleware
const upload = multer({
    storage: multerS3({
      s3: s3, //connect multer my AWS user
      bucket: process.env.AWS_BUCKET_NAME, //connect multer to my bucket
      metadata: function (req, file, cb) { //receive metadata, processes a request a file, and something else
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const username = req.user?.username || 'anonymous';
        cb(null, `profile-pictures/${username}-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });

//generate pre-signed URLs for accessing images
const getSignedImageUrl = async (key) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 86400 // URL expires in 24 hours (in seconds)
    };
    
    return s3.getSignedUrlPromise('getObject', params);
  };

module.exports = { s3, upload, getSignedImageUrl };