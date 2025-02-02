#!/bin/bash

# Prompt user for MySQL connection details
read -p "Enter MySQL host (default: localhost): " MYSQL_HOST
MYSQL_HOST="${MYSQL_HOST:-localhost}"

read -p "Enter MySQL port (default: 3306): " MYSQL_PORT
MYSQL_PORT="${MYSQL_PORT:-3306}"

read -p "Enter MySQL root username (default: root): " MYSQL_ROOT_USER
MYSQL_ROOT_USER="${MYSQL_ROOT_USER:-root}"

read -sp "Ener MySQL root password: " MYSQL_ROOT_PASSWORD
echo

read -p "Enter new admin username (default: admin): " NEW_ADMIN_USER
NEW_ADMIN_USER="${NEW_ADMIN_USER:-admin}"

read -sp "Enter new admin password: " NEW_ADMIN_PASSWORD
echo

read -p "Enter host for new admin user (default: %): " NEW_ADMIN_HOST
NEW_ADMIN_HOST="${NEW_ADMIN_HOST:-%}"

# Create user
create_admin() {
    echo "Creating admin user..."
    sudo mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" <<EOF 
    CREATE USER IF NOT EXISTS '$NEW_ADMIN_USER'@'$NEW_ADMIN_HOST' IDENTIFIED BY '$NEW_ADMIN_PASSWORD';
    GRANT ALL PRIVILEGES ON *.* TO '$NEW_ADMIN_USER'@'$NEW_ADMIN_HOST' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
EOF
}

# Check MySQL connection
echo "Checking MySQL connection..."
mysqladmin -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" ping &> /dev/null

if [ $? -eq 0 ]; then
    echo "Connected to MySQL successfully."
    create_admin
    echo "Admin user created (or already exists)."
else
    echo "Failed to connect to MySQL. Please check you connection settings."
    exit 1
fi