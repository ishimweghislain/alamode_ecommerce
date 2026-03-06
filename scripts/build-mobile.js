const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mobileDir = path.join(__dirname, '..', 'mobile');
const publicMobileDir = path.join(__dirname, '..', 'public', 'mobile');
const apkSource = path.join(mobileDir, 'build', 'app', 'outputs', 'flutter-apk', 'app-release.apk');
const apkDest = path.join(publicMobileDir, 'app-release.apk');

function run() {
    try {
        console.log('--- Starting Mobile Build Process ---');

        // 1. Build Flutter App
        console.log('1. Building Flutter APK (release mode)...');
        execSync('flutter build apk --release', { cwd: mobileDir, stdio: 'inherit' });

        // 2. Ensure public/mobile exists
        console.log('2. Ensuring destination directory exists...');
        if (!fs.existsSync(publicMobileDir)) {
            fs.mkdirSync(publicMobileDir, { recursive: true });
        }

        // 3. Copy APK
        console.log('3. Copying APK to public directory...');
        fs.copyFileSync(apkSource, apkDest);

        console.log('--- Build Successfully Completed ---');
        console.log(`APK located at: ${apkDest}`);
    } catch (error) {
        console.error('--- Build Failed ---');
        console.error(error.message);
        process.exit(1);
    }
}

run();
