# Quan-C Secure Coding

<div align="center">

![QuanCBanner](./image/quan-c.png)

<br>

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

</div>

## Quan C
<b>Quan C</b> is an open source Secure Programming Platform that aims to train developers and IT security practitioners to level up their secure programming knowledges and skills.

<img src="image/homepage.jpeg" alt="Homepage"> <br>

## Usage
Quan C is designed to be flexible for different types of users:
- <u><b>Organizations </b> </u> \
If your organization wants to train employees on specific code vulnerabilities (including those you've encountered in your own systems), you can deploy the app internally and customize the challenges to address those specific issues.

- <u><b>Educators </b> </u> \
For users looking to provide secure coding challenges as part of a curriculum, you can deploy Quan C yourself and set challenges tailored to your students' needs.

- <u><b>Learners </b> </u> \
If you're just looking to improve your secure coding skills without the need to deploy or create custom challenges, you can use the set of challenges we've provided, covering a range of vulnerabilities.

## Overview
- <u><b>Secure Coding Challenges </b> </u> \
Quan C provides an engaging platform for improving secure coding skills through hands-on secure coding challenges.
<br>
<img src="image/profile-challenges.jpeg" alt="Homepage"> <br>

- <u><b>Challenge Solving </b> </u> \
Users can upload their solution to each challenge, and Quan C Runner will automatically validate it by executing the code and testing the application using pre-configured payloads to ensure the submitted code meets the requirements.
<br> <br>
<div style="display: flex; gap: 10px; justify-content: center; align-items: center;">
        <img src="image/submission-success.jpeg" alt="Image 1" style="width: auto; height: 300px;">
        <img src="image/submission-failed.jpeg" alt="Image 2" style="width: auto; height: 300px;">
</div> <br>

- <u><b>Leaderboards </b></u> \
Compete with others by solving challenges and racing to secure the top spot on the leaderboard. Your rank is determined by how quickly you solve problems compared to other users, showcasing both your speed and expertise in secure coding.
<br>
<img src="image/leaderboard.jpeg" alt="Homepage"> <br>

- <u><b>Collaborate With Us </b></u> \
Have a case in mind? Help improve our platform by recommending new challenges and contribute to creating a more robust learning experience for all users.


## Minimum Software Requirements
- Python 3.9.x
- Pip 24.x
- NodeJS 20.9.x
- npm 10.x.x
- Powershell 7 (for Windows only)

## Minimum Hardware Requirements
- Windows 10/11, Server 2019/2022
- Ubuntu 22.04
- vCPU 4 Cores
- RAM 8 GB
- Storage 16 GB

## Quick Start
#### For MacOS user, please refer to [MacOS User Guide](/user-guide/macos.md)
#### For Windows user, please refer to [Windows User Guide](/user-guide/windows.md)
These are the steps to setup and run our program.

1. Run setup script <b>(First time setup only)</b>
    ```
    $ sudo chmod +x setup.sh
    $ ./setup.sh
    ```

2. Setup your .env files. For the detailed guide, please refer to this [documentation](/user-guide/env.md)

3. Insert GitHub ID to populate your database for application admin in this [file](/server/populate_db.js) <b>(OPTIONAL)</b>

    To check GitHub ID, hit this API:
    ```
    https://api.github.com/users/your_github_user_name
    ```

4. Launch the server
    ```
    $ ./start.sh
    ```



## Contributors
- [xhfmvls](https://github.com/xhfmvls)<br>
- [vhsxuz](https://github.com/vhsxuz)<br>
- [newdna](https://github.com/newdna)
