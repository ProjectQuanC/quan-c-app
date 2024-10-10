# Checking env files

$base_dir = Get-Location

$directories = @(
	"$base_dir\client",
	"$base_dir\runner",
	"$base_dir\admin-panel",
	"$base_dir\server"
)
$flag = 0
foreach ($dir in $directories) {
	if (Test-Path $dir) {
		Write-Host "Checking directory: $dir"

		$envFilePath = Join-Path $dir ".env"
		if (Test-Path $envFilePath) {
			Write-Host "Found .env file in: $dir"
		} else {
			Write-Host "No .env file found in: $dir"
			$flag = 1
		}
	} else {
		Write-Host "Directory not found: $dir"
		$flag = 2
	}
	Write-Host "`n"
}
# Exit progress if missing file or directory
if ($flag -ne 0) {
	exit 1;
}

# Check docker engine
$docker = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
if ($docker) {
    Write-Host "Docker is running"
} else {
    Write-Host "Please start your docker desktop..."
    exit 1
}

# Runner
$cmd_runner = 'venv/Scripts/Activate; uvicorn app.main:app --port 8080'
Start-Process pwsh -ArgumentList "-NoExit", "-Command", $cmd_runner -WorkingDirectory $base_dir\runner

# Server
$cmd_server = 'npm start'
Start-Process pwsh -ArgumentList "-NoExit", "-Command", $cmd_server -WorkingDirectory $base_dir\server

# Client
$cmd_client = 'npm start'
Start-Process pwsh -ArgumentList "-NoExit", "-Command", $cmd_client -WorkingDirectory $base_dir\client

# Admin-panel
$cmd_admin = 'npm start'
Start-Process pwsh -ArgumentList "-NoExit", "-Command", $cmd_admin -WorkingDirectory $base_dir\admin-panel