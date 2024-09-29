# Windows OS Installation Guide

## Table of Contents

- [Windows OS Installation Guide](#windows-os-installation-guide)
    - [Table of Contents](#table-of-contents)
    - [Installation](#installation)
        - [Pre-requisites](#pre-requisites)
    - [Setup Github Client](#setup-github-client)
    - [Getting Started](#getting-started)

## Installation
### Pre-requisites
These are the required packaged that will be downloaded
1. Docker
2. NodeJS
3. npm
4. Python3
5. pip
6. MySQL server

Run the installation script using windows terminal as <b>Administrator</b>
```
.\install.ps1
```

## Setup Github Client
1. Access [Developer Settings](https://github.com/settings/developers) in Github.
2. Select OAuth Apps
3. Create new OAuth App
![QuanCBanner](../image/oauth-1.png)
4. Add application informations (The image below is just an example. Fill it with your own information)
![QuanCBanner](../image/oauth-2.png)
5. Create Client Secret
![QuanCBanner](../image/oauth-3.png)
6. Insert the client secret in [.env.example](../server/.env.example)
```
CLIENT_SECRET=[Github Client Secret]
CLIENT_ID=[Github Client ID]
```

## Getting Started
1. Clone the project
```
https://github.com/ProjectQuanC/quan-c-app.git
cd quan-c-app/
```
2. Run the Script
```
#template for windows script
```

3. Go to http://localhost:3000