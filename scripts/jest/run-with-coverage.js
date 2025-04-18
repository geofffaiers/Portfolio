const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Derive source file path from test file path
 * @param {string} testFilePath - Path to the test file
 * @returns {string} Path to the source file
 */
function deriveSourcePath(testFilePath) {
  // Normalize path separators
  const normalizedPath = testFilePath.replace(/\\/g, '/');
  
  // Extract the file name without the .test extension
  const fileName = path.basename(normalizedPath);
  const fileNameWithoutTest = fileName.replace(/\.test\.(ts|js|tsx|jsx)$/, '');
  const extension = path.extname(normalizedPath).replace(/\.test/, '');
  const sourceFileName = `${fileNameWithoutTest}${extension}`;
  
  // Replace __tests__/unit with src in the path
  const dirPath = path.dirname(normalizedPath);
  const sourceDirPath = dirPath.replace('__tests__/unit', 'src');
  
  // Combine to get the source file path
  return path.join(sourceDirPath, sourceFileName);
}

/**
 * Run Jest with coverage for a test file and its corresponding source file
 * @param {string} relativePath - The relative path to the test file
 */
function runJestWithCoverage(relativePath) {
  if (!relativePath) {
    console.error('Error: Test file path is required');
    process.exit(1);
  }
  
  // Extract test file path relative to API directory if it contains "api/__tests__"
  let apiRelativePath = relativePath;
  if (relativePath.includes('api/__tests__')) {
    apiRelativePath = relativePath.substring(relativePath.indexOf('api/__tests__') + 4);
  }
  
  // Calculate the source file path from the test file path
  const sourceFile = deriveSourcePath(relativePath);
  
  console.log(`Test file: ${apiRelativePath}`);
  console.log(`Source file: ${sourceFile}`);
  
  // Determine the API directory path
  const apiDir = path.join(process.cwd(), 'api');
  if (!fs.existsSync(apiDir)) {
    console.error(`API directory not found at ${apiDir}`);
    process.exit(1);
  }
  
  // Build the command
  const args = [
    'test',
    '--',
    apiRelativePath,
    '--coverage',
    `--collectCoverageFrom='${sourceFile.replace(/^.*src\//, 'src/')}'`
  ];
  
  console.log(`Running in ${apiDir}: npm ${args.join(' ')}`);
  
  // Run the npm test command in the API directory
  const testProcess = spawn('npm', args, {
    stdio: 'inherit',
    shell: true,
    cwd: apiDir // Set working directory to API folder
  });
  
  testProcess.on('close', (code) => {
    process.exit(code);
  });
}

// Get the test file path from command line arguments
const [,, relativePath] = process.argv;

runJestWithCoverage(relativePath);
