#!/bin/sh

# Function to check .env
check_env() {
	local fileName=$1
	shift

	if [ -z "$fileName" ] || [ "$#" -lt 3 ]; then
		echo "Usage: checking .env"
		exit 1
	fi

	local allFound=1

	for dir in "$@"; do
		if find "$dir" -type f -name "$fileName" -print -quit | grep -q .; then
			echo "File '$fileName' found in $dir"
		else
			echo "File '$fileName' not found in $dir"
			allFound=0
		fi
	done

	if [ $allFound -eq 1 ]; then
		echo "File '$fileName' found in all specified directories."
	else
		echo "File '$fileName' is missing in one or more directories."
		echo "You can refer to this \e]8;;https://github.com/ProjectQuanC/quan-c-app/blob/main/README.md\aGuidelines\e]8;;\a"
		exit 1
	fi
}

# Call function to check .env
check_env .env ./client ./server ./runner ./admin-panel

# Starting runner

current_dir=$PWD

echo "Starting docker daemon..."
# Comment this if you enabled docker from boot in setup.sh script
sudo service docker start

echo "Starting runner..."
gnome-terminal -- bash -c "cd $current_dir/runner; source venv/bin/activate; uvicorn app.main:app --port 8080;  exec bash"

echo "Starting backend server..."
gnome-terminal -- bash -c "cd $current_dir/server; node populate_db.js; npm start; exec bash"

echo "Starting frontend server..."
gnome-terminal -- bash -c "cd $current_dir/client; npm start; exec bash"

echo "Starting admin-panel..."
gnome-terminal -- bash -c "cd $current_dir/admin-panel; npm start; exec bash"

echo "All server has been started successfully!"
exit
