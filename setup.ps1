# Run script with Admin privilege
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
	Write-Host "This script must be run as Administrator!" -ForeGroundColor Red
	exit
}

# Set Execution Policy
Set-ExecutionPolicy Bypass -Scope Process -Force

# Define required dependencies
$dependencies = @(
	"git",
	"nodejs",
	"python",
	"docker-desktop",
	"mysql"
)

# Display progress
function Show-Progress {
	param (
		[int]$currentStep,
		[int]$totalSteps,
		[string]$status
	)
	$percentComplete = [math]::Round(($currentStep / $totalSteps) * 100)
	Write-Progress -Activity "Installing dependencies" -Status $status -PercentComplete $percentComplete
}

# Check installation of chocolatey
if (-not (Get-Command choco -Erroraction SilentlyContinue)) {
	Write-Host "Chocolatey not found. Installing Chocolatey..."
	$installScript = "https://chocolatey.org/install.ps1"
	Invoke-Expression ((New-Object System.Net.WebClient).DownloadString($installScript))
} else {
	Write-Host "Chocolatey already installed."
}

# Initialize progress
$totalSteps = $dependencies.Count
$currentStep = 0

# Install dependencies using Chocolatey
foreach ($package in $dependencies) {
	$currentStep++
	Show-Progress -currentStep $currentStep -totalSteps $totalSteps -status "Installing $package"

	if (choco list --local-only | Select-String $package) {
		Write-Host "$package is already installed."

	} else {
		Write-Host "Ready to install $package"

		# User confirmation
		$confirm = Read-Host "Do you want to install $package? (y/n)"
		if ($confirm -eq "y") {
			Write-Host "Installing $package..."

			Write-Progress -Activity "Installing dependencies" -Status "Installing $package via Chocolatey" -PercentComplete 100 -Completed
			choco install $package -y
			Show-Progress -currentStep $currentStep -totalSteps $totalSteps -Status "$package installation completed"
		} else {
			Write-Host "Skipping $package installation"
		}
	}
}

# Checking git
Show-Progress -currentStep $currentStep -totalSteps	$totalSteps -status "Configuring Git in PATH"

$gitpath = "C:\Program Files\Git\bin"

# Check git path and adding to env variables
if (Test-Path $gitpath) {
	$currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)

	if (-not ($currentPath -like "*$gitpath*")) {
		Write-Host "Adding Git to PATH..."

		[System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$gitpath", [System.EnvironmentVariableTarget]::Machine)
		$env:Path += ";$gitpath"
		Write-Host "Git has been added to PATH."
	} else {
		Write-Host "Git is already in the PATH."
	}
} else {
	Write-Host "Git installation path not found"
}

# Checking MySQL
Show-Progress -currentStep $currentStep -totalSteps $totalSteps -status "Configuring MySQL in PATH"

$mysqlpath = "C:\tools\mysql\current\bin"

# Check MySQL path and adding to env variables
if (Test-Path $mysqlpath) {
	$currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)

	if (-not ($currentPath -like "*$mysqlpath*")) {
		Write-Host "Adding MySQL to PATH..."
		[System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$mysqlpath", [System.EnvironmentVariableTarget]::Machine)
		$env:Path += ";$mysqlpath"
		Write-Host "MySQL has been added to PATH."
	} else {
		Write-Host "MySQL is already in the PATH."
	}
} else {
	Write-Host "MySQL installation not found"
}

Write-Host "All dependencies are installed!"

Write-Host "Setting up everything..."
Start-Sleep -Seconds 2

$base_dir = $PWD

# Client
cd "$base_dir/client" || { Write-Host "Failed to change to client directory"; exit 1; }
Write-Host "Installing client dependencies..."
npm install

# Admin-panel
cd "$base_dir/admin-panel" || { Write-Host "Failed to change to admin-panel directory"; exit 1; }
Write-Host "Installing admin-panel dependencies..."
npm install

# Server
cd "$base_dir/server" || { Write-Host "Failed to change to server directory"; exit 1; }
Write-Host "Installing server dependencies..."
npm install
npx prisma generate
npx prisma migrate dev
npm run build

# Runner
cd "$base_dir/runner" || { Write-Host "Failed to change to runner directory"; exit 1; }
Write-Host "Installing runner dependencies..."
python -m venv venv
venv/Scripts/Activate
pip install -r requirements.txt
pip install quanchecker
deactivate

Write-Host "Setup finished..."
cd "$base_dir"


Write-Host "Setup complete!"