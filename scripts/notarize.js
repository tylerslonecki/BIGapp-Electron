const { notarize } = require('@electron/notarize');
require('dotenv').config();

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  // Skip notarization in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Skipping notarization in development mode');
    return;
  }
  
  // Skip notarization if identity is null (no signing)
  if (context.packager.config.mac && context.packager.config.mac.identity === null) {
    console.log('Skipping notarization as identity is set to null (no signing)');
    return;
  }

  // Skip notarization if CSC_IDENTITY_AUTO_DISCOVERY is not enabled
  if (process.env.CSC_IDENTITY_AUTO_DISCOVERY !== 'true') {
    console.log('Skipping notarization as CSC_IDENTITY_AUTO_DISCOVERY is not enabled');
    return;
  }

  console.log('Notarizing app...');
  
  const appName = context.packager.appInfo.productFilename;
  const appBundleId = context.packager.config.appId || 'com.yourdomain.BIGapp';

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD || !process.env.APPLE_TEAM_ID) {
    console.warn('Required environment variables missing. Skipping notarization.');
    console.warn('Required: APPLE_ID, APPLE_ID_PASSWORD, APPLE_TEAM_ID');
    return;
  }

  try {
    console.log(`Notarizing ${appName} with Apple ID: ${process.env.APPLE_ID}`);
    console.log('This process may take several minutes...');
    
    const startTime = new Date();
    await notarize({
      appBundleId,
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
    
    const endTime = new Date();
    const elapsedMinutes = ((endTime - startTime) / 1000 / 60).toFixed(2);
    
    console.log(`Notarization completed successfully in ${elapsedMinutes} minutes!`);
    console.log('The app is now ready for distribution.');
  } catch (error) {
    console.error('Notarization failed:', error);
    throw error;
  }
}; 