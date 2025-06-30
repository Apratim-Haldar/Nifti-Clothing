const { S3Client, HeadBucketCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded (fallback if not loaded in main app)
if (!process.env.AWS_S3_BUCKET) {
  dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
  console.log('Loading environment variables in s3Upload middleware...');
}

// Validate environment variables
const validateS3Config = () => {
  const requiredVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required S3 environment variables:', missing);
    throw new Error(`Missing S3 configuration: ${missing.join(', ')}`);
  }
  
  console.log('✅ S3 Configuration loaded:');
  console.log('- Region:', process.env.AWS_REGION);
  console.log('- Bucket:', process.env.AWS_S3_BUCKET);
  console.log('- Access Key ID:', process.env.AWS_ACCESS_KEY_ID.substring(0, 8) + '...');
};

// Validate configuration on startup
try {
  validateS3Config();
} catch (error) {
  console.error('❌ S3 Configuration Error:', error.message);
  console.error('Please check your .env file at:', path.join(__dirname, '..', '..', '.env'));
  process.exit(1);
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Test S3 connection (less aggressive - only log, don't fail startup)
const testS3Connection = async () => {
  try {
    const command = new HeadBucketCommand({ Bucket: process.env.AWS_S3_BUCKET });
    await s3.send(command);
    console.log('✅ S3 bucket connection successful');
  } catch (error) {
    console.log('⚠️  S3 bucket connection warning:', error.message);
    console.log('💡 This might not be critical - S3 operations will still work if credentials are correct');
    
    if (error.code === 'NotFound') {
      console.log('   Reason: The specified bucket does not exist or you do not have access to it');
    } else if (error.code === 'Forbidden' || error.statusCode === 403) {
      console.log('   Reason: Access denied - check your AWS credentials and permissions');
    } else if (error.code === 'NetworkingError') {
      console.log('   Reason: Network connectivity issue');
    }
    console.log('   💡 You can run the debug script: node src/scripts/debugS3.js');
  }
};

// Test connection with delay (don't block startup)
setTimeout(() => {
  testS3Connection();
}, 3000);

// Helper function to generate unique filename
const generateUniqueFilename = (originalname) => {
  const ext = path.extname(originalname);
  const name = path.basename(originalname, ext);
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${name}-${timestamp}-${randomString}${ext}`;
};

// Configure multer for different upload types
const createS3Upload = (folder) => {
  const bucketName = process.env.AWS_S3_BUCKET;
  
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET environment variable is not set');
  }

  return multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      acl: 'public-read',
      key: function (req, file, cb) {
        const filename = generateUniqueFilename(file.originalname);
        const key = `${folder}/${filename}`;
        console.log(`📤 Uploading file to S3: ${bucketName}/${key}`);
        cb(null, key);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { 
          fieldName: file.fieldname,
          originalName: file.originalname,
          uploadDate: new Date().toISOString()
        });
      }
    }),
    fileFilter: function (req, file, cb) {
      console.log('📋 File filter check:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
      
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });
};

// Upload configurations for different types
let uploadProduct, uploadCategory, uploadHero;

try {
  uploadProduct = createS3Upload('products');
  uploadCategory = createS3Upload('categories');
  uploadHero = createS3Upload('hero');
  console.log('✅ S3 upload configurations created successfully');
} catch (error) {
  console.error('❌ Failed to create S3 upload configurations:', error.message);
  process.exit(1);
}

// Helper function to delete file from S3 - FIXED FOR AWS SDK v3
const deleteFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.includes(process.env.AWS_S3_BUCKET)) {
      console.warn('⚠️  Invalid file URL for deletion:', fileUrl);
      return false;
    }

    // Extract key from URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    console.log('🗑️  Deleting file from S3:', deleteParams);
    
    // Use AWS SDK v3 command pattern
    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);
    
    console.log('✅ File deleted successfully from S3');
    return true;
  } catch (error) {
    console.error('❌ Error deleting file from S3:', error);
    return false;
  }
};

// Helper function to get S3 URL
const getS3Url = (key) => {
  const bucketName = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  
  if (!bucketName || !region) {
    throw new Error('Missing S3 configuration for URL generation');
  }
  
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

// Helper function to check if file exists in S3
const fileExistsInS3 = async (key) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    });
    await s3.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
};

// Helper function to get file info from S3
const getFileInfo = async (key) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    });
    const result = await s3.send(command);
    return {
      size: result.ContentLength,
      lastModified: result.LastModified,
      contentType: result.ContentType,
      metadata: result.Metadata
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

// Error handling middleware
const handleS3Error = (error, req, res, next) => {
  console.error('❌ S3 Upload Error Details:', {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack
  });

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        message: 'File too large. Maximum size is 10MB.',
        error: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({ 
      success: false,
      message: `Upload error: ${error.message}`,
      error: error.code
    });
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ 
      success: false,
      message: 'Only image files are allowed!',
      error: 'INVALID_FILE_TYPE'
    });
  }

  // AWS S3 specific errors
  if (error.code === 'AccessDenied') {
    return res.status(403).json({
      success: false,
      message: 'Access denied to S3 bucket. Please check permissions.',
      error: 'S3_ACCESS_DENIED'
    });
  }

  if (error.code === 'NoSuchBucket') {
    return res.status(404).json({
      success: false,
      message: 'S3 bucket not found. Please check configuration.',
      error: 'S3_BUCKET_NOT_FOUND'
    });
  }

  return res.status(500).json({ 
    success: false,
    message: 'Failed to upload file to S3',
    error: 'S3_UPLOAD_FAILED',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

module.exports = {
  uploadProduct,
  uploadCategory, 
  uploadHero,
  deleteFromS3,
  getS3Url,
  fileExistsInS3,
  getFileInfo,
  handleS3Error,
  s3,
  validateS3Config
};