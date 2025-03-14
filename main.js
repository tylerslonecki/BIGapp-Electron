// const log = require('electron-log');
// const { app, BrowserWindow } = require('electron');
// const path = require('path');
// const { spawn } = require('child_process');
// const fs = require('fs');
// const axios = require('axios'); // Ensure axios is installed: npm install axios

// let shinyProcess;
// let mainWindow;
// let shinyPort;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1024,
//     height: 768,
//     icon: path.join(__dirname, 'icon.icns'),
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       enableRemoteModule: false,
//       webSecurity: true,
//     },
//   });

//   mainWindow.loadURL(`http://localhost:${shinyPort}/`);

//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });
// }

// function waitForShinyServer(port, retries = 20, delay = 500) {
//   return new Promise((resolve, reject) => {
//     const attempt = (currentRetry) => {
//       axios.get(`http://localhost:${port}/`)
//         .then(() => resolve())
//         .catch((err) => {
//           if (currentRetry <= 0) {
//             reject(new Error('Shiny server did not start in time.'));
//           } else {
//             setTimeout(() => attempt(currentRetry - 1), delay);
//           }
//         });
//     };
//     attempt(retries);
//   });
// }

// function handleShinyOutput(data) {
//   const output = data.toString().trim();
//   log.info(`Shiny output: ${output}`);

//   // Look for the "Selected port" message
//   const portMatch = output.match(/Selected port: (\d+)/);
//   if (portMatch) {
//     shinyPort = portMatch[1];
//     log.info(`Selected port: ${shinyPort}`);
//   }

//   // Look for the "Listening on" message
//   const listeningMatch = output.match(/Listening on (http:\/\/127\.0\.0\.1:\d+)/);
//   if (listeningMatch) {
//     log.info(`Shiny app is fully running on port ${shinyPort}`);
    
//     // Wait for the Shiny server to be ready before creating the window
//     waitForShinyServer(shinyPort)
//       .then(() => {
//         log.info(`Shiny server is up on port ${shinyPort}. Creating window.`);
//         createWindow();
//       })
//       .catch((err) => {
//         log.error(err.message);
//         app.quit();
//       });
//   }
// }

// function startShinyApp() {
//   let basePath;
//   if (app.isPackaged) {
//     basePath = path.join(process.resourcesPath, 'app.asar.unpacked');
//   } else {
//     basePath = __dirname;
//   }

//   // Add comprehensive logging
//   log.info(`Base path: ${basePath}`);
//   log.info(`Contents of base path: ${fs.readdirSync(basePath)}`);
  
//   const rBinaryPath = path.join(basePath, 'R', 'R.framework', 'Resources', 'bin', 'Rscript');
  
//   log.info(`Attempting to use R binary at: ${rBinaryPath}`);
//   log.info(`R binary exists: ${fs.existsSync(rBinaryPath)}`);

  
//   const rScriptPath = path.join(basePath, 'launch_app.R');

//   // Check if Rscript exists
//   if (!fs.existsSync(rBinaryPath)) {
//     log.error(`Rscript not found at ${rBinaryPath}`);
//     app.quit();
//     return;
//   }

//   if (!fs.existsSync(rScriptPath)) {
//     log.error(`launch_app.R not found at ${rScriptPath}`);
//     app.quit();
//     return;
//   }

//   // Start the Shiny app
//   log.info(`Starting Shiny app with command: "${rBinaryPath}" "${rScriptPath}"`);

//   shinyProcess = spawn(rBinaryPath, [rScriptPath]);

//   // Listen to stdout
//   shinyProcess.stdout.on('data', (data) => {
//     handleShinyOutput(data);
//   });

//   // Listen to stderr
//   shinyProcess.stderr.on('data', (data) => {
//     handleShinyOutput(data);
//   });

//   shinyProcess.on('close', (code) => {
//     log.info(`Shiny process exited with code ${code}`);
//     // If the Shiny app closes, quit the Electron app
//     app.quit();
//   });
// }

// app.whenReady().then(() => {
//   log.info('Electron app is ready.');
//   startShinyApp();

//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0 && shinyPort) {
//       createWindow();
//     }
//   });
// });

// app.on('window-all-closed', () => {
//   // Terminate the Shiny process when all windows are closed
//   if (shinyProcess) {
//     shinyProcess.kill();
//     shinyProcess = null;
//   }
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });


// const { app, BrowserWindow } = require('electron');
// const path = require('path');
// const log = require('electron-log');
// const fs = require('fs');
// const os = require('os');
// const { spawn } = require('child_process');

// let mainWindow;
// let shinyPort;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1024,
//     height: 768,
//     icon: path.join(__dirname, 'icon.ico'),
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       enableRemoteModule: false,
//       webSecurity: true,
//     },
//   });

//   // Open DevTools
//   mainWindow.webContents.openDevTools();

//   // Add event listeners for crash events
//   mainWindow.webContents.on('crashed', () => {
//     log.error('Renderer process crashed.');
//     console.error('Renderer process crashed.');
//   });

//   mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
//     log.error(`Failed to load URL: ${errorDescription} (${errorCode})`);
//     console.error(`Failed to load URL: ${errorDescription} (${errorCode})`);
//   });

//   mainWindow.on('unresponsive', () => {
//     log.warn('Window is unresponsive.');
//     console.warn('Window is unresponsive.');
//   });

//   mainWindow.on('closed', () => {
//     log.info('Window was closed.');
//     console.log('Window was closed.');
//   });
// }


// function startShinyApp() {
//   const platform = os.platform();
//   let rBinaryPath;
//   let rScriptPath;

//   // Determine the base path
//   let basePath;
//   log.info(`app.isPackaged: ${app.isPackaged}`);
//   if (app.isPackaged) {
//     basePath = path.join(process.resourcesPath, 'app.asar.unpacked');
//     log.info(`Base path (packaged): ${basePath}`);
//   } else {
//     basePath = __dirname;
//     log.info(`Base path (development): ${basePath}`);
//   }

//   // Set the Rscript binary path
//   if (app.isPackaged) {
//     if (platform === 'win32') {
//       rBinaryPath = path.join(basePath, 'R', 'bin', 'Rscript.exe');
//     } else if (platform === 'darwin') {
//       rBinaryPath = path.join(basePath, 'R', 'R.framework', 'Resources', 'bin', 'Rscript');
//     } else if (platform === 'linux') {
//       rBinaryPath = path.join(basePath, 'R', 'bin', 'Rscript');
//     } else {
//       log.error(`Unsupported platform: ${platform}`);
//       app.quit();
//       return;
//     }
//   } else {
//     // In development mode, use system Rscript
//     rBinaryPath = 'Rscript';
//   }

//   // Set the path to the R script
//   rScriptPath = path.join(basePath, 'launch_app.R');

//   // Check if Rscript exists (only when packaged)
//   if (app.isPackaged && !fs.existsSync(rBinaryPath)) {
//     log.error(`Rscript not found at ${rBinaryPath}`);
//     app.quit();
//     return;
//   }

//   if (!fs.existsSync(rScriptPath)) {
//     log.error(`launch_app.R not found at ${rScriptPath}`);
//     app.quit();
//     return;
//   }

//   // Start the Shiny app
//   log.info(`Starting Shiny app with command: ${rBinaryPath} ${rScriptPath}`);

//   const shinyProcess = spawn(rBinaryPath, [rScriptPath]);

//   // Log stdout and stderr in real-time
//   shinyProcess.stdout.on('data', (data) => {
//     const message = data.toString();
//     log.info(`Shiny stdout: ${message}`);
  
//     // Extract port number
//     const portMatch = message.match(/Selected port: (\d+)/);
//     if (portMatch) {
//       shinyPort = portMatch[1];
//       log.info(`Detected Shiny app port: ${shinyPort}`);
//     }
  
//     // Detect when Shiny app is ready
//     const listeningMatch = message.match(/Listening on http:\/\/127\.0\.0\.1:(\d+)/);
//     if (listeningMatch && shinyPort) {
//       log.info(`Shiny app is ready at port ${shinyPort}`);
  
//       // Load the Shiny app in Electron window
//       if (mainWindow) {
//         mainWindow.loadURL(`http://127.0.0.1:${shinyPort}/`);
//       }
//     }
//   });
  

//   shinyProcess.stderr.on('data', (data) => {
//     log.error(`Shiny stderr: ${data}`);
//   });

//   shinyProcess.on('close', (code) => {
//     log.info(`Shiny process exited with code ${code}`);
//     app.quit();
//   });

//   shinyProcess.on('error', (err) => {
//     log.error(`Failed to start Shiny process: ${err}`);
//     app.quit();
//   });
// }

// app.whenReady().then(() => {
//   createWindow();
//   startShinyApp();

//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   // On macOS, it's common for applications to stay open until the user explicitly quits
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });


const log = require('electron-log');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const axios = require('axios'); // Ensure axios is installed: npm install axios
const os = require('os');

let shinyProcess = null;
let mainWindow = null;
let shinyPort = null;
let isQuitting = false; // Flag to prevent multiple quit attempts

/**
 * Creates the main Electron BrowserWindow and loads the Shiny app.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'icon.icns'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
  });

  // Load the Shiny app URL
  mainWindow.loadURL(`http://localhost:${shinyPort}/`);

  // Optional: Open DevTools for debugging
  // mainWindow.webContents.openDevTools();

  // Handle window events
  mainWindow.on('closed', () => {
    log.info('Main window was closed.');
    mainWindow = null;
  });

  mainWindow.webContents.on('crashed', () => {
    log.error('Renderer process crashed.');
    console.error('Renderer process crashed.');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log.error(`Failed to load URL: ${errorDescription} (${errorCode})`);
    console.error(`Failed to load URL: ${errorDescription} (${errorCode})`);
  });

  mainWindow.on('unresponsive', () => {
    log.warn('Window is unresponsive.');
    console.warn('Window is unresponsive.');
  });
}

/**
 * Waits for the Shiny server to respond on the specified port.
 * @param {number} port - The port number to check.
 * @param {number} retries - Number of retry attempts.
 * @param {number} delay - Delay between retries in milliseconds.
 * @returns {Promise} - Resolves if the server responds, rejects otherwise.
 */
function waitForShinyServer(port, retries = 20, delay = 500) {
  return new Promise((resolve, reject) => {
    const attempt = (currentRetry) => {
      axios.get(`http://localhost:${port}/`)
        .then(() => resolve())
        .catch(() => {
          if (currentRetry <= 0) {
            reject(new Error('Shiny server did not start in time.'));
          } else {
            setTimeout(() => attempt(currentRetry - 1), delay);
          }
        });
    };
    attempt(retries);
  });
}

/**
 * Handles the output from the Shiny server process.
 * Parses stdout and stderr to detect server readiness.
 * @param {Buffer} data - The data chunk from the process.
 */
function handleShinyOutput(data) {
  const output = data.toString().trim();
  log.info(`Shiny output: ${output}`);

  // Extract the selected port from the output
  const portMatch = output.match(/Selected port: (\d+)/);
  if (portMatch) {
    shinyPort = portMatch[1];
    log.info(`Selected port: ${shinyPort}`);
  }

  // Detect when the Shiny app is fully running
  const listeningMatch = output.match(/Listening on (http:\/\/127\.0\.0\.1:\d+)/);
  if (listeningMatch) {
    log.info(`Shiny app is fully running on port ${shinyPort}`);

    // Wait for the Shiny server to be ready before creating the window
    waitForShinyServer(shinyPort)
      .then(() => {
        log.info(`Shiny server is up on port ${shinyPort}. Creating window.`);
        createWindow();
      })
      .catch((err) => {
        log.error(err.message);
        app.quit();
      });
  }
}

/**
 * Starts the Shiny app by spawning the R process.
 */
function startShinyApp() {
  const platform = os.platform();
  let rBinaryPath;
  let rScriptPath;

  // Determine the base path based on whether the app is packaged
  let basePath;
  log.info(`app.isPackaged: ${app.isPackaged}`);
  if (app.isPackaged) {
    basePath = path.join(process.resourcesPath, 'app.asar.unpacked');
    log.info(`Base path (packaged): ${basePath}`);
  } else {
    basePath = __dirname;
    log.info(`Base path (development): ${basePath}`);
  }

  // Set the R binary path based on the platform
  if (app.isPackaged) {
    if (platform === 'win32') {
      rBinaryPath = path.join(basePath, 'R', 'bin', 'R.exe'); // Using R.exe on Windows
    } else if (platform === 'darwin') {
      rBinaryPath = path.join(basePath, 'R', 'R.framework', 'Resources', 'bin', 'R');
    } else if (platform === 'linux') {
      rBinaryPath = path.join(basePath, 'R', 'bin', 'Rscript'); // Consistent with Linux
    } else {
      log.error(`Unsupported platform: ${platform}`);
      app.quit();
      return;
    }
  } else {
    // In development mode, use system R binary (ensure it's in PATH)
    if (platform === 'win32') {
      rBinaryPath = 'R.exe';
    } else {
      rBinaryPath = 'R';
    }
  }

  // Set the path to the R script
  rScriptPath = path.join(basePath, 'launch_app.R');

  // Check if R binary exists (only when packaged)
  if (app.isPackaged && !fs.existsSync(rBinaryPath)) {
    log.error(`R binary not found at ${rBinaryPath}`);
    app.quit();
    return;
  }

  // Check if the R script exists
  if (!fs.existsSync(rScriptPath)) {
    log.error(`launch_app.R not found at ${rScriptPath}`);
    app.quit();
    return;
  }

  // Log the command being used to start Shiny
  log.info(`Starting Shiny app with command: "${rBinaryPath}" "${rScriptPath}"`);

  // Spawn the R process to run the Shiny app
  shinyProcess = spawn(rBinaryPath, ['--slave', '--no-restore', '-f', rScriptPath], {
    stdio: 'pipe',
    windowsHide: true, // Hides the R console window
    detached: true,    // Detaches the process to its own process group
  });

  // Handle process errors
  shinyProcess.on('error', (err) => {
    log.error(`Failed to start Shiny process: ${err}`);
    app.quit();
  });

  // Listen to stdout for Shiny output
  shinyProcess.stdout.on('data', (data) => {
    handleShinyOutput(data);
  });

  // Listen to stderr for Shiny errors
  shinyProcess.stderr.on('data', (data) => {
    handleShinyOutput(data);
  });

  // Handle process closure
  shinyProcess.on('close', (code) => {
    log.info(`Shiny process exited with code ${code}`);
    app.quit();
  });
}

/**
 * Terminates the Shiny process and its child processes.
 * Uses 'taskkill' on Windows and process.kill on other platforms.
 * @returns {Promise} Resolves when termination is complete.
 */
function terminateShinyProcess() {
  return new Promise((resolve, reject) => {
    if (!shinyProcess) {
      log.warn('No Shiny process to terminate.');
      return resolve();
    }

    const platform = os.platform();

    if (platform === 'win32') {
      // Use taskkill to terminate the process and its child processes
      const killCommand = `taskkill /PID ${shinyProcess.pid} /T /F`;
      log.info(`Executing termination command: ${killCommand}`);

      exec(killCommand, (err, stdout, stderr) => {
        if (err) {
          log.error(`Failed to kill Shiny process: ${err}`);
          return reject(err);
        }
        log.info('Shiny process terminated successfully.');
        return resolve();
      });
    } else {
      // For non-Windows platforms, terminate the process group
      try {
        process.kill(-shinyProcess.pid, 'SIGTERM');
        log.info('Shiny process group terminated successfully.');
        return resolve();
      } catch (error) {
        if (error.code === 'ESRCH') {
          log.warn('Shiny process already terminated (ESRCH).');
          return resolve();
        } else {
          log.error(`Failed to kill Shiny process: ${error}`);
          return reject(error);
        }
      }
    }
  });
}

// Application event handlers

app.whenReady().then(() => {
  log.info('Electron app is ready.');
  startShinyApp();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && shinyPort) {
      createWindow();
    }
  });
});

// Close the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Handles termination of the Shiny process before quitting the application.
 * The flag 'isQuitting' prevents re‑entry and app.exit() ensures a clean exit.
 */
app.on('before-quit', (event) => {
  if (shinyProcess && !isQuitting) {
    event.preventDefault(); // Prevent the default quit behavior
    isQuitting = true;
    log.info('Attempting to terminate Shiny process before quitting.');

    terminateShinyProcess()
      .then(() => {
        log.info('Shiny process terminated successfully. Exiting application.');
        app.exit(0); // Exit without re‑invoking before-quit
      })
      .catch((err) => {
        log.error(`Error terminating Shiny process: ${err}`);
        app.exit(1); // Optionally exit even if termination fails
      });
  }
});


