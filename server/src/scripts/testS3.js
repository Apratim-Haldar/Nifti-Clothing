const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

console.log('🔍 S3 Debug Script - Enhanced Credential Analysis\n');

// Display current configuration
console.log('📋 Current Configuration:');
console.log(`- .env file path: ${envPath}`);
console.log(`- AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.substring(0, 12) + '...' : 'NOT SET'}`);
console.log(`- AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '***' + process.env.AWS_SECRET_ACCESS_KEY.slice(-4) : 'NOT SET'}`);
console.log(`- AWS_REGION: ${process.env.AWS_REGION || 'NOT SET'}`);
console.log(`- AWS_S3_BUCKET: ${process.env.AWS_S3_BUCKET || 'NOT SET'}`);
console.log('');

// Check for any whitespace or special characters in credentials
if (process.env.AWS_ACCESS_KEY_ID) {
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  console.log('🔍 Credential Analysis:');
  console.log(`- Access Key Length: ${accessKey.length} characters`);
  console.log(`- Contains whitespace: ${/\s/.test(accessKey) ? 'YES ⚠️' : 'NO ✅'}`);
  console.log(`- Contains special chars: ${/[^A-Za-z0-9]/.test(accessKey) ? 'YES ⚠️' : 'NO ✅'}`);
}

if (process.env.AWS_SECRET_ACCESS_KEY) {
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
  console.log(`- Secret Key Length: ${secretKey.length} characters`);
  console.log(`- Contains whitespace: ${/\s/.test(secretKey) ? 'YES ⚠️' : 'NO ✅'}`);
}
console.log('');

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.AWS_S3_BUCKET) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

async function debugS3Connection() {
  console.log('🧪 Running comprehensive S3 tests...\n');

  try {
    // Method 1: Direct credential configuration
    console.log('1️⃣ Testing direct credential configuration...');
    
    const directS3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
      region: process.env.AWS_REGION.trim(),
      signatureVersion: 'v4'
    });

    try {
      // Test credentials by making a simple API call
      const identity = await directS3.config.credentials.getPromise();
      console.log('   ✅ Direct credentials loaded successfully');
      console.log(`   🔑 Access Key: ${identity.accessKeyId.substring(0, 8)}...`);
    } catch (credError) {
      console.log('   ❌ Failed to load direct credentials:', credError.message);
      
      // Try alternative credential loading methods
      console.log('\n🔄 Trying alternative credential methods...');
      
      // Method 2: Using AWS.config.update
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
        region: process.env.AWS_REGION.trim()
      });
      
      const configS3 = new AWS.S3();
      
      try {
        const configIdentity = await configS3.config.credentials.getPromise();
        console.log('   ✅ Config-based credentials loaded successfully');
        console.log(`   🔑 Access Key: ${configIdentity.accessKeyId.substring(0, 8)}...`);
      } catch (configError) {
        console.log('   ❌ Config-based credentials also failed:', configError.message);
        
        // Method 3: Manual credential object
        console.log('\n🔄 Trying manual credential object...');
        
        const manualCredentials = new AWS.Credentials({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim()
        });
        
        const manualS3 = new AWS.S3({
          credentials: manualCredentials,
          region: process.env.AWS_REGION.trim()
        });
        
        try {
          await manualCredentials.getPromise();
          console.log('   ✅ Manual credentials object loaded successfully');
        } catch (manualError) {
          console.log('   ❌ Manual credentials also failed:', manualError.message);
          console.log('\n💡 Possible issues:');
          console.log('   - AWS credentials might be invalid or expired');
          console.log('   - Network connectivity issues');
          console.log('   - AWS service temporarily unavailable');
          console.log('   - Special characters in credentials causing parsing issues');
          return;
        }
      }
    }

    // Proceed with the working S3 instance
    const s3 = directS3;
    const bucketName = process.env.AWS_S3_BUCKET.trim();

    // Test 2: List all buckets
    console.log('\n2️⃣ Testing bucket listing...');
    try {
      const bucketsResponse = await s3.listBuckets().promise();
      console.log(`   ✅ Successfully connected to AWS S3`);
      console.log(`   📊 Found ${bucketsResponse.Buckets.length} buckets in your account:`);
      
      let targetBucketFound = false;
      bucketsResponse.Buckets.forEach((bucket, index) => {
        const isTarget = bucket.Name === bucketName;
        if (isTarget) targetBucketFound = true;
        console.log(`      ${index + 1}. ${bucket.Name} ${isTarget ? '⭐ (TARGET BUCKET)' : ''}`);
      });

      if (!targetBucketFound) {
        console.log(`\n   ❌ Target bucket '${bucketName}' not found in your account!`);
        console.log('   💡 Available options:');
        console.log('      1. Use one of the existing buckets listed above');
        console.log('      2. Create the bucket manually in AWS console');
        console.log('      3. Check if the bucket is in a different AWS account');
        return;
      } else {
        console.log(`\n   ✅ Target bucket '${bucketName}' found in your account`);
      }

    } catch (listError) {
      console.log('   ❌ Failed to list buckets:', listError.message);
      console.log('   🔍 Error details:', {
        code: listError.code,
        statusCode: listError.statusCode,
        retryable: listError.retryable
      });
      
      if (listError.code === 'InvalidAccessKeyId') {
        console.log('   💡 Your AWS Access Key ID appears to be invalid');
        return;
      } else if (listError.code === 'SignatureDoesNotMatch') {
        console.log('   💡 Your AWS Secret Access Key appears to be invalid');
        return;
      } else if (listError.code === 'AccessDenied') {
        console.log('   💡 Your credentials don\'t have permission to list buckets');
        console.log('   💡 This might be okay - let\'s try direct bucket access');
      } else {
        console.log('   💡 Network or service issue - let\'s try direct bucket access');
      }
    }

    // Test 3: Direct bucket access
    console.log('\n3️⃣ Testing direct bucket access...');
    try {
      const headResult = await s3.headBucket({ Bucket: bucketName }).promise();
      console.log('   ✅ Successfully accessed target bucket');
      console.log('   📍 Bucket exists and is accessible');
    } catch (headError) {
      console.log('   ❌ Failed to access bucket:', headError.message);
      console.log('   🔍 Error details:', {
        code: headError.code,
        statusCode: headError.statusCode,
        region: headError.region
      });
      
      if (headError.statusCode === 403) {
        console.log('   💡 Possible causes:');
        console.log('      - Your AWS user lacks s3:ListBucket permission for this bucket');
        console.log('      - Bucket policy blocks your access');
        console.log('      - Bucket is in a different region');
      } else if (headError.statusCode === 404) {
        console.log('   💡 Bucket does not exist or is in a different region');
      }
      return;
    }

    // Test 4: Simple upload test
    console.log('\n4️⃣ Testing upload capability...');
    const testKey = `test-connection-${Date.now()}.txt`;
    const testContent = 'S3 connection test';
    
    try {
      const uploadResult = await s3.putObject({
        Bucket: bucketName,
        Key: testKey,
        Body: testContent,
        ContentType: 'text/plain'
      }).promise();
      
      console.log('   ✅ Test upload successful');
      console.log('   📤 Upload details:', {
        ETag: uploadResult.ETag,
        Location: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${testKey}`
      });
      
      // Clean up
      await s3.deleteObject({
        Bucket: bucketName,
        Key: testKey
      }).promise();
      console.log('   ✅ Test file cleaned up');
      
    } catch (uploadError) {
      console.log('   ❌ Upload test failed:', uploadError.message);
      console.log('   🔍 Error details:', {
        code: uploadError.code,
        statusCode: uploadError.statusCode
      });
      return;
    }

    console.log('\n🎉 All S3 tests completed successfully!');
    console.log('🔧 Your S3 configuration is working correctly.');
    console.log('\n📝 Summary:');
    console.log(`   ✅ Credentials: Valid`);
    console.log(`   ✅ Bucket Access: Working`);
    console.log(`   ✅ Upload/Delete: Working`);
    console.log(`   ✅ Region: ${process.env.AWS_REGION}`);
    console.log(`   ✅ Bucket: ${bucketName}`);

  } catch (error) {
    console.error('\n❌ Unexpected error during S3 testing:', error.message);
    console.error('🔍 Full error details:', error);
  }
}

debugS3Connection();