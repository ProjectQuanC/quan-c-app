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