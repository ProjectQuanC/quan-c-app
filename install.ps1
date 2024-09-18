# Define required dependencies

$dependencies = @(
	"git",
	"nodejs",
	"python",
)

# Check installation of chocolatey
if (-not (Get-Command choco -Erroraction SilentlyContinue)) {
	Write-Host "Chocolatey not found. Installing Chocolatey..."
	Set-ExecutionPolicy Bypass -Scope Process -Force
	[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072 iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
} else {
	Write-Host "Chocolatey already installed."
}

# Install dependencies using Chocolatey
foreach ($package in $dependencies) {
	if (choco list --local-only | Select-String $package) {
		Write-Host "$package is already installed."
	} else {
		Write-Host "Installing $package..."
		choco install $package -y
	}
}

Write-Host "All dependencies are installed!"
