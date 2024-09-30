import signal
from fastapi import FastAPI, HTTPException, File, UploadFile, Form, BackgroundTasks
from python_on_whales import DockerClient
import docker
import asyncio
from pydantic import BaseModel
import os
import shutil
import time
from datetime import datetime
import requests
import json
import importlib.util
import pymysql
from dotenv import load_dotenv
import hashlib

load_dotenv()
MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_DB = os.getenv('MYSQL_DB')
MYSQL_PORT = int(os.getenv('MYSQL_PORT'))

class Submission(BaseModel):
    id: str
    challenge_id: str
    user_id: str
    test_case_total: int

app = FastAPI()

def delete_images_by_name(image_name):
    client = docker.from_env()

    for image in client.images.list(all=True):
        image_tags = image.tags
        if f"{image_name}-app:latest" in image_tags:
            client.images.remove(image.id, force=True)
        if f"{image_name}-db:latest" in image_tags:
            client.images.remove(image.id, force=True)

def shut_container(docker: DockerClient, destination_dir: str):
    docker.compose.down(volumes=True, quiet=True)
    if os.path.exists(destination_dir):
        shutil.rmtree(destination_dir)

def get_container_port(container_id: str):
    client = docker.from_env()
    container = client.containers.get(container_id)
    ports = container.attrs["NetworkSettings"]["Ports"]
    for port_info, _ in ports.items():
        # port = port_info.split("/")[0]
        if port_info == '8080/tcp':
            host_port = ports[port_info][0]["HostPort"]
            return host_port
    return None

def get_container_id(image_tag: str):
    client = docker.from_env()
    for container in client.containers.list(all=True):
        if image_tag in container.image.tags:
            return container.id
    return None
    
def get_dir_data(file_path):
    try:
        with open(file_path, "r") as file:
            first_line = file.readline().strip()
            second_line = file.readline().strip()
            return first_line, second_line
    except FileNotFoundError:
        # print(f"File not found: {file_path}")
        return None, None

def get_pass_test_case_value(max_num, num_list):
    total_sum = 0
    for num in num_list:
        if num <= max_num:
            total_sum += 2 ** (num - 1)
    return total_sum

def generate_log(container_id):
    client = docker.from_env()

    try:
        container = client.containers.get(container_id)
        logs = container.logs().decode('utf-8')
        log_hash = hashlib.sha256(logs.encode()).hexdigest()
        log_file_path = os.path.join("logs", f"{log_hash}.log")
        if not os.path.exists(log_file_path):
            with open(log_file_path, 'w') as log_file:
                log_file.write(logs)
    except docker.errors.NotFound:
        return None
    except Exception as e:
        return None
    return log_hash

def save_log():
    pass

def execute_query(query, params):
    connection = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        port=MYSQL_PORT
    )
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
        connection.commit()  # Commit the transaction
    except Exception as e:
        print("Error executing query:", e)
    finally:
        connection.close()

def insert_submission(submission_id: str, user_id: str, challenge_id: str, status: bool, passed_test_case_value: int, log_file_path: str = None):
    if log_file_path:
        query = 'INSERT INTO submission (submission_id, user_id, challenge_id, status, passed_test_case_value, log_file_path) VALUES (%s, %s, %s, %s, %s, %s);'
        params = (submission_id, user_id, challenge_id, status, passed_test_case_value, log_file_path)
    else:
        query = 'INSERT INTO submission (submission_id, user_id, challenge_id, status, passed_test_case_value) VALUES (%s, %s, %s, %s, %s);'
        params = (submission_id, user_id, challenge_id, status, passed_test_case_value)

    try:
        execute_query(query, params)
    except Exception as e:
        print(f"Error: {e}")
    return
    
def run_tests(submission: Submission, port: int):
    submission_id = submission.id
    user_id = submission.user_id
    challenge_id = submission.challenge_id
    test_case_total = submission.test_case_total

    checker_path = os.path.join("challenges", challenge_id, "checker.py")
    if not os.path.exists(checker_path):
        return None
    
    spec = importlib.util.spec_from_file_location("checker", checker_path)
    checker = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(checker)
    
    test_cases = checker.test_cases
    passed_test_case = []


    # time.sleep(30) # Not needed because the compose would wait for database container to be ready
    for idx, test in enumerate(test_cases):
        checking_method = test['checking_method']
        # checking_method = response_based_check
        url = test['url']
        url = url.replace("(port)", str(port))
        header = test['header']
        method = test['method']
        body = test['body']
        expected = test['expected']

        if checking_method(body, url, header, method, expected):
            passed_test_case.append(idx + 1)

    passed_test_case_value = get_pass_test_case_value(test_case_total, passed_test_case)
    if len(passed_test_case) == 0:
        container_id = get_container_id(f"{submission_id}-app:latest")
        logs_path = generate_log(container_id)
        insert_submission(submission_id, user_id, challenge_id, 0, passed_test_case_value, f"{logs_path}.log")
    elif len(passed_test_case) != len(test_cases):
        container_id = get_container_id(f"{submission_id}-app:latest")
        logs_path = generate_log(container_id)
        insert_submission(submission_id, user_id, challenge_id, 0, passed_test_case_value, f"{logs_path}.log")
    else:
        insert_submission(submission_id, user_id, challenge_id, 1, passed_test_case_value)
    return


def build_and_run_docker(submission: Submission, destination_dir: str):
    submission_id = submission.id
    start_time = time.time()
    # Create the Docker client and build the Docker image
    try:
        docker = DockerClient(compose_files=[os.path.join(destination_dir, "docker-compose.yml")])
        docker.compose.build(quiet=True)
        docker.compose.up(detach=True, quiet=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while creating the Docker client: {e}")

    # Get the container ID and port
    container_id = get_container_id(f"{submission_id}-app:latest")
    port = get_container_port(container_id)

    # Check if the application is running
    flag = False
    for _ in range(10):
        try:
            response = requests.get(f"http://localhost:{port}")
            if response.status_code == 200:
                flag = True
                break
        except Exception as e:
            time.sleep(5)
    if not flag:
        container_id = get_container_id(f"{submission_id}-app:latest")
        logs_path = generate_log(container_id)
        insert_submission(submission_id, submission.user_id, submission.challenge_id, 0, 0, f"{logs_path}.log")
        shut_container(docker, destination_dir)
        return
        # raise HTTPException(status_code=500, detail="The application did not start successfully")
    
    # Run test cases on the application
    if flag:
        run_tests(submission, port)

    end_time = time.time()
    print(f"Execution duration: {end_time - start_time:.2f}s")

    # Stop the container and remove the volume
    shut_container(docker, destination_dir)

    # Delete the containers and images
    delete_images_by_name(submission_id)
    return

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.delete("/cancel-submission")
async def cancel_submission(submission_id: str):
    pass

@app.post("/create-submission")
async def create_submission(
    id: str = Form(...),
    challenge_id: str = Form(...),
    user_id: str = Form(...),
    test_case_total: int = Form(...),
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    # Create the Submission instance from form data
    submission = Submission(id=id, challenge_id=challenge_id, user_id=user_id, test_case_total=test_case_total)
    submission_id = submission.id
    challenge_id = submission.challenge_id
    file_name = file.filename

    # Set the source and destination directories
    source_dir = os.path.join("challenges", challenge_id)
    destination_dir = os.path.join("submissions", submission_id)

    if not os.path.exists(source_dir):
        raise HTTPException(status_code=404, detail=f"Source directory not found: {source_dir}")

    if os.path.exists(destination_dir):
        shutil.rmtree(destination_dir)

    # Copy the source directory to the destination directory
    try:
        shutil.copytree(source_dir, destination_dir)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while copying the directory: {e}")

    # Save the uploaded file to the destination directory
    replace_txt = os.path.join(destination_dir, "replace.txt")
    if os.path.exists(replace_txt):
        file_type, replace_file_name = get_dir_data(replace_txt)
        if file_type == file_name.split(".")[-1]:
            replace_file_path = os.path.join(destination_dir, "app", replace_file_name)
            with open(replace_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        else:
            raise HTTPException(status_code=400, detail=f"False Extension, should be {file_type} instead of {file_name.split('.')[-1]}")
    else:
        raise HTTPException(status_code=404, detail=f"Replace File not found")

    # Schedule long-running tasks in background
    background_tasks.add_task(
        build_and_run_docker, submission, destination_dir
    )

    return {"message": "Submission creation started", "submission_id": submission_id}

# uvicorn app.main:app --port 8080