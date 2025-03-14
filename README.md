# BIGapp

A minimal golem-based Shiny app packaged with Electron.

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

## R Directory Setup

This application requires an R/ directory in the root of the project to build locally and run correctly. This directory is not included in the repository but is packaged into the app during the build process (specified in the `asarUnpack` section of package.json).

The easiest way to set up the R/ directory is to copy it directly from an existing R installation:

1. Locate your R installation directory:
   - **Windows**: Typically `C:\Program Files\R\R-x.x.x` (where x.x.x is your R version)
   - **macOS**: Typically `/Library/Frameworks/R.framework/Resources`
   - **Linux**: Typically `/usr/lib/R` or `/usr/local/lib/R`

2. Copy the entire R directory to the root of this project:
```bash
# Example for macOS
cp -R /Library/Frameworks/R.framework/Resources R
```

3. Ensure that the `launch_app.R` script in the root directory correctly references the files in your R/ directory.

Alternatively, if you prefer to set up a minimal R directory manually:

1. Create an R/ directory in the root of the project:
```bash
mkdir -p R
```

2. Add your R packages, scripts, and other required R files to this directory. The directory structure should be:
```
R/
├── library/            # R packages
├── bin/                # R executable files
└── your-shiny-app/     # Your Shiny application files
```

Note: The R/ directory is essential for both development and production builds. When the application is packaged, these files will be unpacked from the ASAR archive and made available to the application at runtime.

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