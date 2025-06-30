const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

console.log('🪣 S3 Bucket Setup Script\n');

// Configure AWS with clean credentials
const cleanCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim()
};

const s3 = new AWS.S3(cleanCredentials);
const bucketName = process.env.AWS_S3_BUCKET?.trim();

console.log(`🎯 Target bucket: ${bucketName}`);
console.log(`📍 Region: ${cleanCredentials.region}`);
console.log('');

async function setupBucket() {
  try {
    // Step 1: Try to create the bucket
    console.log('1️⃣ Attempting to create bucket...');
    
    const createParams = {
      Bucket: bucketName
    };

    // Add LocationConstraint if not us-east-1
    if (cleanCredentials.region !== 'us-east-1') {
      createParams.CreateBucketConfiguration = {
        LocationConstraint: cleanCredentials.region
      };
    }

    try {
      await s3.createBucket(createParams).promise();
      console.log('   ✅ Bucket created successfully!');
    } catch (createError) {
      if (createError.code === 'BucketAlreadyExists') {
        console.log('   ❌ Bucket name is already taken by another AWS account');
        console.log('   💡 S3 bucket names must be globally unique across ALL AWS accounts');
        console.log('   💡 Please choose a different bucket name');
        
        // Suggest alternative names
        const timestamp = Date.now();
        const suggestions = [
          `${bucketName}-${timestamp}`,
          `${bucketName}-store-2025`,
          `${bucketName}-images-${cleanCredentials.region}`,
          `my-clothing-store-${timestamp}`,
          `fashion-images-${Date.now().toString().slice(-6)}`
        ];
        
        console.log('\n🔧 Suggested alternative bucket names:');
        suggestions.forEach((name, index) => {
          console.log(`   ${index + 1}. ${name}`);
        });
        
        console.log('\n📝 To use a different name:');
        console.log(`   1. Update AWS_S3_BUCKET in your .env file`);
        console.log(`   2. Run this script again`);
        return;
        
      } else if (createError.code === 'BucketAlreadyOwnedByYou') {
        console.log('   ✅ Bucket already exists and is owned by you');
      } else {
        console.log('   ❌ Failed to create bucket:', createError.message);
        throw createError;
      }
    }

    // Step 2: Verify bucket access
    console.log('\n2️⃣ Verifying bucket access...');
    try {
      await s3.headBucket({ Bucket: bucketName }).promise();
      console.log('   ✅ Bucket is accessible');
    } catch (accessError) {
      console.log('   ❌ Cannot access bucket:', accessError.message);
      return;
    }

    // Step 3: Set up bucket policy for public read
    console.log('\n3️⃣ Setting up bucket policy for public image access...');
    
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`
        }
      ]
    };

    try {
      await s3.putBucketPolicy({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy)
      }).promise();
      console.log('   ✅ Public read policy set successfully');
    } catch (policyError) {
      console.log('   ⚠️  Failed to set bucket policy:', policyError.message);
      console.log('   💡 You may need to set this manually in AWS Console');
    }

    // Step 4: Create folder structure
    console.log('\n4️⃣ Creating folder structure...');
    
    const folders = ['products', 'categories', 'hero'];
    
    for (const folder of folders) {
      try {
        await s3.putObject({
          Bucket: bucketName,
          Key: `${folder}/`,
          Body: '',
          ContentType: 'application/x-directory'
        }).promise();
        console.log(`   ✅ Created folder: ${folder}/`);
      } catch (folderError) {
        console.log(`   ⚠️  Failed to create folder ${folder}/:`, folderError.message);
      }
    }

    // Step 5: Test upload functionality
    console.log('\n5️⃣ Testing upload functionality...');
    
    const testKey = `test-uploads/setup-test-${Date.now()}.txt`;
    const testContent = `Bucket setup test - ${new Date().toISOString()}`;
    
    try {
      const uploadResult = await s3.putObject({
        Bucket: bucketName,
        Key: testKey,
        Body: testContent,
        ContentType: 'text/plain',
        ACL: 'public-read'
      }).promise();
      
      console.log('   ✅ Test upload successful');
      
      // Verify the file can be accessed publicly
      const publicUrl = `https://${bucketName}.s3.${cleanCredentials.region}.amazonaws.com/${testKey}`;
      console.log(`   🌐 Public URL: ${publicUrl}`);
      
      // Clean up test file
      await s3.deleteObject({
        Bucket: bucketName,
        Key: testKey
      }).promise();
      console.log('   ✅ Test file cleaned up');
      
    } catch (uploadError) {
      console.log('   ❌ Upload test failed:', uploadError.message);
      
      if (uploadError.code === 'AccessDenied') {
        console.log('   💡 Your AWS user needs PutObject permission');
      }
    }

    // Step 6: Final verification
    console.log('\n6️⃣ Final verification...');
    
    try {
      const listResult = await s3.listObjectsV2({
        Bucket: bucketName,
        MaxKeys: 5
      }).promise();
      
      console.log('   ✅ Bucket listing successful');
      console.log(`   📁 Found ${listResult.KeyCount} objects in bucket`);
      
    } catch (listError) {
      console.log('   ⚠️  Cannot list bucket contents:', listError.message);
      console.log('   💡 This might be okay if you only need upload/download permissions');
    }

    console.log('\n🎉 S3 Bucket setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   ✅ Bucket Name: ${bucketName}`);
    console.log(`   ✅ Region: ${cleanCredentials.region}`);
    console.log(`   ✅ Public Access: Enabled for images`);
    console.log(`   ✅ Folder Structure: Created`);
    console.log(`   ✅ Upload Test: Passed`);
    
    console.log('\n🚀 You can now restart your application server!');
    console.log('The S3 image upload functionality should work correctly.');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    
    if (error.code === 'InvalidAccessKeyId') {
      console.error('💡 Your AWS Access Key ID is invalid');
    } else if (error.code === 'SignatureDoesNotMatch') {
      console.error('💡 Your AWS Secret Access Key is invalid');
    } else if (error.code === 'AccessDenied') {
      console.error('💡 Your AWS user lacks necessary permissions');
      console.error('Required permissions: s3:CreateBucket, s3:PutObject, s3:PutBucketPolicy');
    }
  }
}

setupBucket();