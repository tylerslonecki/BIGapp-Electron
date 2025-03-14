# BIGapp

BIGapp Shiny app packaged with Electron.

## Project Structure

This is the main directory containing all the application code and resources. The parent directory contains a simple wrapper package.json that delegates commands to this directory.

## Environment Setup

This project uses environment variables for code signing configuration. To set up your environment:

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Apple Developer certificate information in the `.env` file:
   - `APPLE_ID`: Your name as it appears in the Apple Developer account
   - `APPLE_ID_EMAIL`: Your Apple ID email used for development
   - `APPLE_TEAM_ID`: Your Apple Team ID (found in your Developer Account)
   - `APPLE_SIGNING_IDENTITY`: Your signing identity hash (from Keychain Access)
   - `CSC_NAME`: The full name of your signing certificate
   - `CSC_LINK`: Path to your exported .p12 certificate file (if you have one)
   - `CSC_KEY_PASSWORD`: Password for your .p12 certificate file (if you have one)

3. The `.env` file is ignored by git to keep your credentials secure. Only the `.env.example` template is committed to the repository.

## Building the App

To build the app for different platforms:

```bash
# For Apple Silicon (M1/M2) Macs
npm run build:mac-arm64

# For Intel Macs
npm run build:mac-x64

# For Windows
npm run build:win

# For signed Mac build
npm run build:mac-signed

# For universal Mac build (Intel + ARM)
npm run build:mac-universal
```

The built application will be available in the `dist` directory. 
