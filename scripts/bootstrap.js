#!/usr/bin/env node
/**
 * bootstrap.js - prefer yarn, fallback to npm (with translation of bootstrap steps)
 *
 * Behavior:
 * - If not run from repo root OR args passed -> forward command to package manager (yarn preferred, fallback to npm)
 * - If run from root with no args -> run bootstrap:
 *     - if yarn available: run `yarn bootstrap`
 *     - else if npm available: run equivalent npm commands:
 *         1) npm --prefix ./example install
 *         2) npm install
 *
 * This is required because package.json's bootstrap script uses yarn commands.
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);

const options = {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
  encoding: 'utf-8',
};
if (os.type() === 'Windows_NT') {
  options.shell = true;
}

function commandExists(cmd) {
  try {
    if (os.type() === 'Windows_NT') child_process.execSync(`where ${cmd}`, { stdio: 'ignore' });
    else child_process.execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function runSync(cmd, cmdArgs, opts) {
  console.log(`\n> ${cmd} ${cmdArgs.join(' ')}  (cwd: ${opts.cwd})\n`);
  const res = child_process.spawnSync(cmd, cmdArgs, opts);
  if (res.error) {
    console.error(`Error executing ${cmd}:`, res.error && res.error.message ? res.error.message : res.error);
    return { status: 1, error: res.error };
  }
  return { status: res.status || 0 };
}

const hasYarn = commandExists('yarn');
const hasNpm = commandExists('npm');

if (!hasYarn && !hasNpm) {
  console.error('Neither yarn nor npm were found in PATH. Please install one of them and re-run.');
  process.exit(1);
}

function hasBootstrapScript() {
  try {
    const pkgPath = path.join(root, 'package.json');
    if (!fs.existsSync(pkgPath)) return false;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return !!(pkg && pkg.scripts && typeof pkg.scripts.bootstrap === 'string');
  } catch (e) {
    return false;
  }
}

let result = { status: 0 };

if (process.cwd() !== root || args.length) {
  // Forward args to preferred package manager (yarn preferred)
  if (hasYarn) {
    result = runSync('yarn', args.length ? args : [], options);
  } else {
    // npm fallback: forward args to npm (same args may behave differently; that's expected)
    result = runSync('npm', args.length ? args : [], options);
  }
} else {
  // At repo root with no args -> perform bootstrap
  // But package.json's bootstrap script uses yarn, so translate to npm if needed.
  if (!hasBootstrapScript()) {
    console.error('No "bootstrap" script found in package.json at repo root. Nothing to run.');
    console.error('You can still run `yarn <cmd>` or `npm <cmd>` manually from this directory.');
    process.exit(1);
  }

  if (hasYarn) {
    // run yarn bootstrap
    result = runSync('yarn', ['bootstrap'], options);
    // If yarn bootstrap fails but npm exists, try npm equivalent as fallback
    if (result.status !== 0 && hasNpm) {
      console.warn('yarn bootstrap failed; attempting npm-equivalent bootstrap...');
      // fall through to npm-equivalent
    } else {
      // done (either success or yarn not present)
      if (result.status !== 0) process.exit(result.status);
    }
  }

  if (!hasYarn && hasNpm) {
    console.log('Yarn not found; using npm to perform bootstrap-equivalent steps.');
  }

  // If yarn is missing or yarn bootstrap failed and npm present, run npm-equivalent steps:
  if (hasNpm) {
    // package.json.bootstrap = "yarn example && yarn install"
    // npm-equivalent:
    // 1) npm --prefix ./example install
    // 2) npm install (root)
    // run step 1
    const step1 = runSync('npm', ['--prefix', 'example', 'install'], options);
    if (step1.status !== 0) {
      console.error('Failed to install dependencies in ./example using npm.');
      process.exit(step1.status);
    }
    // run step 2
    const step2 = runSync('npm', ['install'], options);
    if (step2.status !== 0) {
      console.error('Failed to install root dependencies using npm.');
      process.exit(step2.status);
    }
    result = { status: 0 };
  }
}

// propagate exit status
process.exitCode = (result && typeof result.status === 'number') ? result.status : 1;
