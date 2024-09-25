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
	"python"
)

# Display progress
function Show-Progress {
	param {
		[int]$currentStep,
		[int]$totalSteps,
		[string]$status
	}
	$percentComplete = [math]::Round(($currentStep / $totalSteps) * 100)
	Write-Progress -Activity "Installing dependenvies" -Status $status -PercentComplete $percentComplete
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
			choco install $package -y
		} else {
			Write-Host "Skipping $package installation"
		}
	}
}

Write-Host "All dependencies are installed!"
Write-Host "Setup complete!"
Write-Host -Activity "Installation" -Status "Complete" -Completed