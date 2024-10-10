# Windows Installation Guide

## Table of Contens

- [Installation](#installation)
    - [Pre-requisite](#pre-requisite)
- [Getting Started](#getting-started)

## Installation

### Pre-requisites
1. [Docker](https://www.docker.com/products/docker-desktop/)
2. [MySQL](https://dev.mysql.com/downloads/mysql/)
3. [Python](https://www.python.org/downloads/windows/)
4. [NodeJS](https://nodejs.org/en/download/prebuilt-installer)
5. [Git](https://git-scm.com/downloads/win)
6. [Powershell 7](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4#msi)

<b>Ensure everything placed in the PATH environment variables</b>

## Getting Started

<b>Important!</b>
Make sure you have powershell 7 installed

1. Clone the repository
    ```
    git clone https://github.com/ProjectQuanC/quan-c-app.git
    ```
    or if you are using SSH
    ```
    git@github.com:ProjectQuanC/quan-c-app.git
    ```

2. Setup your [GitHub Application](/user-guide/env.md#setup-github-client)

3. Setup your [MySQL Server](/user-guide/env.md#login-to-mysql-server)

4. Create .env files for each server, client, admin-panel, and runner <br>
<b>There are .env.example provided already</b>

5. Run the setup script and wait for the script to autosetup the application
    ```
    .\setup.ps1
    ```

6. Run the start script to start the servers
    ```
    .\start.ps1
    ```