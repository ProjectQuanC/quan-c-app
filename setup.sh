#!/bin/bash

sudo apt update -y

packages=(
	"git"
	"curl"
	"python3"
	"python3-pip"
	"python3-venv"
	"mysql-server"
)

for package in "${packages[@]}"; do
	echo "Installing $package..."
	sudo apt install -y "$package"
	echo "Finished installing $package"
done


# Installing Docker Desktop

# For Ubuntu 24.04 LTS
if dpkg --compare-versions "$VERSION" "eq" "24.04"; then
	sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
fi

# Checking desktop env
DESKTOP_ENV=$(echo $XDG_CURRENT_DESKTOP)

if [[ "$DESKTOP_ENV" == *"GNOME"* ]]; then
	echo "You are running GNOME"
	echo "Installing Docker Desktop"
else
	echo "Installing GNOME..."
	sudo apt install -y gnome-terminal
	echo "Installing Docker Desktop"
fi

sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable to start docker daemon on boot
#sudo systemctl enable docker.service
#sudo systemctl enable containerd.service

# Installing nodejs and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Installing Node.js..."
nvm install 22

sleep 1

#=========================================================================

echo "Setting up...."

sleep 3

base_dir=$PWD
./sqlcreate.sh

# client
cd "$base_dir/client" || { echo "Failed to change to client directory"; exit 1; }
echo "Installing client dependencies...."
npm install

# admin-panel
cd "$base_dir/admin-panel" || { echo "Failed to change to admin-panel directory"; exit 1; }
echo "Installing admin panel dependencies...."
npm install

# server
cd "$base_dir/server" || { echo "Failed to change to server directory"; exit 1; }
echo "Installing server dependencies...."
npm install
npx prisma generate
npx prisma migrate dev
read -p "Please input your github username: " username
export USER_NAME="$username"
node populate_db.js
npm run build

# runner
cd "$base_dir/runner" || { echo "Failed to change to runner directory"; exit 1; }
echo "Installing runner dependencies...."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install quanchecker
deactivate

echo "Setup finished..."

cd "$base_dir"
echo "Restarting the terminal..."
sleep 2
kill -9 $$
