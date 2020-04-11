const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' })

const autoScaling = new AWS.AutoScaling();
const asgName = 'hamsterASG';
const lcName = 'hamsterLC';
const policyName = 'hamsterPolicy';
const tgArn = 'arn:aws:elasticloadbalancing:us-east-1:667926569251:targetgroup/hamsterTG/6267b394c979e17c';

createAutoScalingGroup(asgName, lcName)
  .then(() => createASGPolicy(asgName, policyName))
  .then((data) => console.log(data))

function createAutoScalingGroup(asgName, lcName) {
  const param = {
    AutoScalingGroupName: asgName,
    AvailabilityZones: [ // Needs to match the loadbalancer subnets
      'us-east-1a',
      'us-east-1b'
    ],
    TargetGroupARNs: [
      tgArn
    ],
    LaunchConfigurationName: lcName,
    MaxSize: 2, // Max Instances
    MinSize: 1 // Min Instances
  }

  return new Promise((resolve, reject) => {
    autoScaling.createAutoScalingGroup(param, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    });
  });
}

function createASGPolicy(asgName, policyName) {
  const param = {
    AdjustmentType: 'ChangeInCapacity', // What the policy should do
    AutoScalingGroupName: asgName,
    PolicyName: policyName,
    PolicyType: 'TargetTrackingScaling',
    TargetTrackingConfiguration: {
      TargetValue: 5, // Scale up if the average utilization is 5% 
      PredefinedMetricSpecification: {
        PredefinedMetricType: 'ASGAverageCPUUtilization'
      }
    }
  };

  return new Promise((resolve, reject) => {
    autoScaling.putScalingPolicy(param, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    });
  });
}
