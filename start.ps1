# Checking env files

$base_dir = $PWD

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
$docker = Get-Process -Name "com.docker.service" -ErrorAction SilentlyContinue
if ($docker) {
    Write-Host "Docker is running"
} else {
    Write-Host "Please start your docker desktop..."
    exit 1
}

# Runner
$cmd_runner = 'cd $base_dir/runner; venv/Scripts/Activate; uvicorn app.main:app --port 8000'
Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd_runner

# Server
$cmd_server = 'cd $base_dir/server; npm start'
Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd_server

# Client
$cmd_client = 'cd $base_dir/client; npm start'
Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd_client

# Admin-panel
$cmd_admin = 'cd $base_dir/admin-panel; npm start'
Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd_admin