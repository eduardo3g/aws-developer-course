const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' })

const ec2 = new AWS.EC2()

// Volume to detach/attach
const volumeId = 'vol-02e5caae7255d55c7'

// Instance to attach
const instanceId = 'i-07064c30133c40b9a'

detachVolume(volumeId)
.then(() => attachVolume(instanceId, volumeId))

function detachVolume (volumeId) {
  const params = {
    VolumeId: volumeId
  };

  return new Promise((resolve, reject) => {
    ec2.detachVolume(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    });
  });
}

function attachVolume (instanceId, volumeId) {
  const params = {
    InstanceId: instanceId,
    VolumeId: volumeId,
    Device: '/dev/sdf' // Name the volume will be referenced in the attached instance
  };

  return new Promise((resolve, reject) => {
    ec2.attachVolume(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    });
  });
}
