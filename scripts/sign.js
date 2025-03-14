require('dotenv').config();
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

exports.default = async function signing(context) {
  const { electronPlatformName, appOutDir, packager } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  // Skip signing in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Skipping signing in development mode');
    return;
  }

  // Set environment variables for electron-builder
  process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'true';
  
  const appName = packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;
  
  if (!process.env.CSC_NAME) {
    console.warn('CSC_NAME environment variable is missing. Skipping manual signing.');
    return;
  }

  console.log('Signing application:', appPath);
  console.log('Using identity:', process.env.CSC_NAME);

  try {
    // Sign the application bundle
    await execAsync(`codesign --force --options runtime --sign "${process.env.CSC_NAME}" "${appPath}"`);
    console.log('Application signed successfully');
    
    // Verify the signature
    await execAsync(`codesign --verify --verbose "${appPath}"`);
    console.log('Signature verified successfully');
  } catch (error) {
    console.error('Error during signing:', error);
    throw error;
  }
}; 