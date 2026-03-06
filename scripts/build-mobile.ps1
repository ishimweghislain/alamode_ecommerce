#!/usr/bin/env pwsh

# ALAMODE Mobile Build & Deploy Script

$PublicDir = "$PSScriptRoot\public\mobile"
$MobileDir = "$PSScriptRoot\mobile"
$ApkSource = "$MobileDir\build\app\outputs\flutter-apk\app-release.apk"
$ApkDest = "$PublicDir\app-release.apk"

Write-Host "🚀 Starting ALAMODE Mobile Build Process..." -ForegroundColor Cyan

# 1. Create destination directory if it doesn't exist
if (!(Test-Path $PublicDir)) {
    Write-Host "📁 Creating public/mobile directory..."
    New-Item -Path $PublicDir -ItemType Directory | Out-Null
}

# 2. Build the Flutter APK
Write-Host "🛠️ Running Flutter build..." -ForegroundColor Yellow
Set-Location $MobileDir
flutter build apk --release

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# 3. Copy APK to public folder
if (Test-Path $ApkSource) {
    Write-Host "📦 Copying APK to $ApkDest..." -ForegroundColor Green
    Copy-Item -Path $ApkSource -Destination $ApkDest -Force
    Write-Host "✅ Mobile app deployment complete!" -ForegroundColor Green
    Write-Host "📍 Download URL: https://www.alamode.rw/download" -ForegroundColor Cyan
} else {
    Write-Host "❌ APK not found at $ApkSource" -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot
