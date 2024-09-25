
# Quan C Community Guidelines

## The Community

Quan C is an open-source secure programming training platform which allows other developers to contribute for the community by submitting their own programs containing vulnerable code to be showcased as a challenge for other developers to test their secure programming knowledges and skills by trying to solve the challenge.

## How To Contribute

There are some steps involve in making your own challenge, we are going to explain it to you. But you can also see one of the example case provided by us below.

>#### [[PathGuard by xhfmvls]](https://github.com/xhfmvls/PathGuard.git)

>#### [[Sequel-Express-Injection by xhfmvls]](https://github.com/xhfmvls/Sequel-Express-Injection)

---

## Requirements

### 1. Programming Language

First you need to define which programming language you will be using in making the case. For now Quan C supports these types of programming language.

> - Python
> - JavaScript
> - Java
> - PHP

You're also allowed to propose challenges using other programming languages besides those mentioned above.

### 2. Create Gitub Project Repository

You can named your own repository that will represent the name of the case later on. So it will be nice if you can came up with some **cool names** for the repository. Of course you want to have a **unique**, **cool**, and **fun challenge** for everyone!

> We are expecting you are familiarized enough with GitHub, but if you don't then you can follow these instructions to create your own GitHub repository.

##### IMPORTANT!
##### Make sure that Git is installed

You can check your git installation by using this command.
```
git --version
```

If there is no git installed, you can download it from here.

[**Git Download**](https://www.git-scm.com/downloads)

---

##### 2.1 Create Root Directory
```
mkdir [repository name]
```

##### 2.2 Initialize your git project inside the directory
```
cd [repository name]
git init -b main
```

##### 2.3 Define File Structure

You are freely to define how complex the program will be, maybe there will be many subdirectories or maybe there will be many dependencies and it's all up to your creativity but there are some **files that are required** and **must be inside the repository**.

The repository structure should be like this

```
[repository name]
    ├─ vulnerable code (required) # can be main or index or app and etc
    ├─ vulnerable-fixed code (required) # code that has been fixed from the vulnerability
    ├─ dependencies (required)
    ├─ checker.py (required) 
    ├─ database file (optional) # if you are using a database
    ├─ dotenv file (optional)
    ├─ readme (optional)
    └─ Dockerfile (optional)
```

> - Notice that ```checker.py``` is a file that consists of the test cases that you are going to define.
> - Dependencies are vary based on which programming language you are using, e.g. 
> ```requirements.txt``` for python
> ```package.json``` for nodejs

##### 2.4 Push Repository to GitHub

After finishing up your program or you want to save any changes you can use this command

```
git add .
```

Then commit your changes

```
git commit -m "write commit message here"
```

Finally, push your changes to GitHub

```
git push origin main
```

### 3. Submit Your Challenge

To  submit your challenge, you can email us through **project.quanc@gmail.com** with the format

```
<Email Title>
Quan C Challenge Submission - (your github username) 
-------------------------------------------------------------------------------
<Email Body>
Challenge Name: [Your challenge name]
GitHub URL: [Your challenge GitHub repository URL]
Total Test Cases: [Integer consist of how many test cases that you've prepared]
Difficulty: [Challenges difficulty between easy/medium/hard]
Explanation: Brief explanations about the program and the vulnerability that you made
```

### 4. Wait For Our Approval Email
We will send you approval email about your submitted challenges and we will featured your GitHub as the creator of the challenge and contributor to the community.

##### We'll be looking for your contribution and don't forget to join our [Discord](https://discord.gg/N84JgfhpQE)!