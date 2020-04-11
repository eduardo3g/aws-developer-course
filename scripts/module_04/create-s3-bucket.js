const AWS = require('aws-sdk');
var uuid = require('node-uuid');

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();

createBucket(`hamster-bucket-${uuid.v1()}`)
  .then((data) => console.log(data))

function createBucket(bucketName) {
  const params = {
    Bucket: bucketName,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3.createBucket(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    });
  });
}
