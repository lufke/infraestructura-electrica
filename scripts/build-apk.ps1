$timestamp = Get-Date -Format "yyyyMMdd-HHmm"
$env:APP_NAME = "Infra $timestamp"

Write-Host "Building APK with name: $env:APP_NAME"
Write-Host "Output file: builds/infra-$timestamp.apk"

# Ensure the builds directory exists
if (!(Test-Path -Path "builds")) {
    New-Item -ItemType Directory -Path "builds" | Out-Null
}

eas build -p android --profile preview --local --output "builds/infra-$timestamp.apk"
