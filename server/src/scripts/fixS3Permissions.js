const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

console.log('🔐 S3 Permissions Diagnostic and Fix\n');

// Configure AWS
const cleanCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim()
};

const s3 = new AWS.S3(cleanCredentials);
const iam = new AWS.IAM(cleanCredentials);
const bucketName = process.env.AWS_S3_BUCKET?.trim();

console.log(`🎯 Target bucket: ${bucketName}`);
console.log(`📍 Region: ${cleanCredentials.region}`);
console.log('');

async function diagnoseAndFixPermissions() {
  try {
    // Step 1: Get current user identity
    console.log('1️⃣ Checking current AWS identity...');
    
    const sts = new AWS.STS(cleanCredentials);
    try {
      const identity = await sts.getCallerIdentity().promise();
      console.log('   ✅ Current AWS Identity:');
      console.log(`      User ARN: ${identity.Arn}`);
      console.log(`      Account ID: ${identity.Account}`);
      console.log(`      User ID: ${identity.UserId}`);
      
      // Extract username from ARN
      const username = identity.Arn.split('/').pop();
      console.log(`      Username: ${username}`);
      
    } catch (identityError) {
      console.log('   ❌ Cannot get identity:', identityError.message);
    }

    // Step 2: Test specific S3 permissions
    console.log('\n2️⃣ Testing S3 permissions...');
    
    const permissions = [
      { action: 'HeadBucket', description: 'Check if bucket exists' },
      { action: 'ListObjects', description: 'List bucket contents' },
      { action: 'PutObject', description: 'Upload files' },
      { action: 'GetObject', description: 'Download files' },
      { action: 'DeleteObject', description: 'Delete files' }
    ];

    for (const perm of permissions) {
      try {
        switch (perm.action) {
          case 'HeadBucket':
            await s3.headBucket({ Bucket: bucketName }).promise();
            break;
          case 'ListObjects':
            await s3.listObjectsV2({ Bucket: bucketName, MaxKeys: 1 }).promise();
            break;
          case 'PutObject':
            await s3.putObject({
              Bucket: bucketName,
              Key: 'test-permissions.txt',
              Body: 'Permission test',
              ContentType: 'text/plain'
            }).promise();
            break;
          case 'GetObject':
            await s3.getObject({
              Bucket: bucketName,
              Key: 'test-permissions.txt'
            }).promise();
            break;
          case 'DeleteObject':
            await s3.deleteObject({
              Bucket: bucketName,
              Key: 'test-permissions.txt'
            }).promise();
            break;
        }
        console.log(`   ✅ ${perm.action}: ${perm.description} - ALLOWED`);
      } catch (permError) {
        console.log(`   ❌ ${perm.action}: ${perm.description} - DENIED`);
        console.log(`      Error: ${permError.code} - ${permError.message}`);
      }
    }

    // Step 3: Check bucket ownership
    console.log('\n3️⃣ Checking bucket ownership...');
    
    try {
      const aclResult = await s3.getBucketAcl({ Bucket: bucketName }).promise();
      console.log('   ✅ Bucket ACL retrieved successfully');
      console.log('   👤 Bucket Owner:', aclResult.Owner.DisplayName || aclResult.Owner.ID);
      
      // Check if current user has permissions in ACL
      const userHasPermission = aclResult.Grants.some(grant => 
        grant.Grantee.ID === aclResult.Owner.ID || 
        grant.Grantee.Type === 'Group'
      );
      
      if (userHasPermission) {
        console.log('   ✅ User appears to have ACL permissions');
      } else {
        console.log('   ⚠️  User may not have sufficient ACL permissions');
      }
      
    } catch (aclError) {
      console.log('   ❌ Cannot retrieve bucket ACL:', aclError.message);
      if (aclError.code === 'AccessDenied') {
        console.log('   💡 This suggests you don\'t own the bucket or lack permissions');
      }
    }

    // Step 4: Try to get bucket policy
    console.log('\n4️⃣ Checking bucket policy...');
    
    try {
      const policyResult = await s3.getBucketPolicy({ Bucket: bucketName }).promise();
      console.log('   ✅ Bucket policy found');
      
      try {
        const policy = JSON.parse(policyResult.Policy);
        console.log('   📋 Policy statements:');
        policy.Statement.forEach((statement, index) => {
          console.log(`      ${index + 1}. Effect: ${statement.Effect}`);
          console.log(`         Actions: ${Array.isArray(statement.Action) ? statement.Action.join(', ') : statement.Action}`);
          console.log(`         Principal: ${JSON.stringify(statement.Principal)}`);
        });
      } catch (parseError) {
        console.log('   ⚠️  Could not parse bucket policy');
      }
      
    } catch (policyError) {
      if (policyError.code === 'NoSuchBucketPolicy') {
        console.log('   ℹ️  No bucket policy configured');
        console.log('   💡 Bucket uses default permissions (ACL-based)');
      } else {
        console.log('   ❌ Cannot read bucket policy:', policyError.message);
      }
    }

    // Step 5: Provide recommendations
    console.log('\n5️⃣ Recommendations:\n');
    
    console.log('🔧 To fix S3 access issues, you have several options:\n');
    
    console.log('Option 1: Create your own bucket');
    console.log('   - The current bucket might belong to someone else');
    console.log('   - Use a unique bucket name like: nifti-clothing-yourname-2025');
    console.log('   - Update AWS_S3_BUCKET in your .env file');
    console.log('   - Run the setupS3Bucket.js script');
    
    console.log('\nOption 2: If you own this bucket, add IAM permissions');
    console.log('   - Go to AWS IAM Console');
    console.log('   - Find your user: nifti-clothing-admin');
    console.log('   - Add this inline policy:');
    
    const iamPolicy = {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject",
            "s3:GetObjectAcl",
            "s3:PutObjectAcl"
          ],
          "Resource": `arn:aws:s3:::${bucketName}/*`
        },
        {
          "Effect": "Allow",
          "Action": [
            "s3:ListBucket",
            "s3:GetBucketLocation",
            "s3:GetBucketAcl"
          ],
          "Resource": `arn:aws:s3:::${bucketName}`
        }
      ]
    };
    
    console.log('\n' + JSON.stringify(iamPolicy, null, 2));
    
    console.log('\nOption 3: Use AWS CLI to test (if you have it installed)');
    console.log(`   aws s3 ls s3://${bucketName}/`);
    console.log(`   aws s3 cp test.txt s3://${bucketName}/test.txt`);

  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error.message);
  }
}

diagnoseAndFixPermissions();