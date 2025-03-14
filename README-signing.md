# macOS App Signing and Notarization Guide

This guide explains how to set up the BIGapp Electron application for signing and notarization on macOS.

## Prerequisites

1. An Apple Developer account
2. A Developer ID Application certificate
3. An app-specific password for your Apple ID

## Setup

### 1. Environment Variables

Create or edit the `.env` file in the project root. Fill in your actual developer details:

```
# Apple ID email used for development
APPLE_ID="your.email@example.com"
# Your app-specific password for your Apple ID
APPLE_ID_PASSWORD="app-specific-password"
# Your Apple Team ID (from your Developer Account)
APPLE_TEAM_ID="XXXXXXXXXX"

# The full name of your signing certificate
CSC_NAME="Developer ID Application: Your Name (XXXXXXXXXX)"

# Path to your exported .p12 certificate file (if you have one)
CSC_LINK="/path/to/your/certificate.p12"
# Password for your .p12 certificate file (if you have one)
CSC_KEY_PASSWORD="your-certificate-password"

# For automatic certificate discovery
CSC_IDENTITY_AUTO_DISCOVERY=true
```

### 2. Create App-Specific Password

If you don't have an app-specific password for your Apple ID:

1. Go to [appleid.apple.com](https://appleid.apple.com/)
2. Sign in with your Apple ID
3. In the Security section, click "Generate Password" under "App-Specific Passwords"
4. Use this password for the `APPLE_ID_PASSWORD` environment variable

### 3. Find Your Team ID

1. Log in to [developer.apple.com](https://developer.apple.com/)
2. Go to "Membership" section
3. Your Team ID is displayed in the membership information

### 4. Verify Your Certificate

To verify your signing certificate is correctly installed:

```bash
security find-identity -v -p codesigning
```

Look for a "Developer ID Application" certificate in the list.

## Building for macOS

### Building a Signed macOS App

To build a signed application:

```bash
npm run build:mac-signed
```

This will:
1. Sign the application with your Developer ID
2. Notarize the application with Apple
3. Create a distributable DMG file

### Building for Different Architectures

- For Intel Macs: `npm run build:mac-x64`
- For Apple Silicon Macs: `npm run build:mac-arm64`
- For Universal Binary: `npm run build:mac-universal`

## Troubleshooting

### Signing Issues

If you encounter signing issues:

1. Check that your Developer ID certificate is valid and not expired
2. Verify that the certificate name in `.env` matches exactly what's in Keychain Access
3. Make sure the entitlements files exist at `build/entitlements.mac.plist` and `build/entitlements.mac.inherit.plist`

### Notarization Issues

If you encounter notarization issues:

1. Verify that your Apple ID, app-specific password, and Team ID are correct
2. Check that you have a valid paid Apple Developer account
3. Ensure your app meets Apple's security requirements (no custom dynamic libraries, etc.)
4. Check the logs for specific error messages from Apple's notarization service

## Process Details

The signing and notarization process works as follows:

1. The `electron-builder` tool signs the app during build using your Developer ID certificate
2. After signing, the `afterSign` hook runs the `scripts/notarize.js` script
3. The notarization script uploads your app to Apple's notarization service
4. Once notarized, the app is stapled with a ticket verifying it passed notarization

This entire process is automated by the build scripts in `package.json`. 