import requests
import json
import hashlib
import docker
import secrets
import time

def response_based_check(body: str, url: str, header: str, method: str, expected: str):
    response = requests.request(method, url, headers=header, data=body)
    try:
        response_body = json.loads(response.text)
    except:
        response_body = response.text
    if response_body == expected:
        return True
    return False

def response_hash_check(body: str, url: str, header: str, method: str, expected: str):
    response = requests.request(method, url, headers=header, data=body)
    content_hash = hashlib.sha256(response.content).hexdigest()
    if content_hash.lower() == expected.lower():
        return True
    return False

def response_contain_check(body: str, url: str, header: str, method: str, expected: str):
    response = requests.request(method, url, headers=header, data=body)
    if expected in response.text:
        return True
    return False

def response_contain_check_inverse(body: str, url: str, header: str, method: str, expected: str):
    response = requests.request(method, url, headers=header, data=body)
    if expected in response.text:
        return False
    return True

def generate_random_tag():
    return secrets.token_hex(4)

def generate_random_port():
    return secrets.randbelow(65535 - 1024) + 1024

def get_container_logs(image_name):
    client = docker.from_env()
    container_info = client.containers.list(all=True, filters={"ancestor": image_name})

    if not container_info:
        return []
    
    container_id = container_info[0].id
    container = client.containers.get(container_id)

    logs = container.logs()
    decoded_logs = logs.decode('utf-8')
    return decoded_logs

def delete_containers_and_images_by_name(image_name):
    client = docker.from_env()

    for container in client.containers.list(all=True):
        container_image_name = container.image.attrs['RepoTags'][0]
        if image_name in container_image_name:
            container.stop()
            container.remove(force=True)
            
    for image in client.images.list(all=True):
        image_tags = image.tags
        if f"{image_name}:latest" in image_tags:
            client.images.remove(image.id, force=True)

def build_image(port: int, image_tag: str):
    client = docker.from_env()
    try:
        image, build_logs = client.images.build(path=".", tag=image_tag, rm=True)

        container = client.containers.run(image_tag, detach=True, ports={'8080/tcp': port})
    except docker.errors.BuildError as e:
        error_message = {
            "error": "Build error",
            "message": list(e.build_log)
        }
        return False, error_message
    except docker.errors.APIError as e:
        error_message = {
            "error": "API error",
        }
        return False, error_message
    return True, build_logs

def run_tests_dev(test_data):
    port = 8080
    
    passed_test_case = []
    for idx, test in enumerate(test_data):
        checking_method = test['checking_method']
        url = test['url']
        url = url.replace("(port)", str(port))
        header = test['header']
        method = test['method']
        body = test['body']
        expected = test['expected']
        
        if checking_method(body, url, header, method, expected):
            passed_test_case.append(idx + 1)
    if len(passed_test_case) == 0:
        response_body = {
            "message": "No test cases passed, possible Error",
        }
    elif len(passed_test_case) != len(test_data):
        response_body = {
            "message": "Not all test cases passed, perhaps wrong logic or runtime error",
            "total_answer": len(test_data),
            "passed_test_case": passed_test_case,
        }
    else:
        response_body = {
            "message": "All test cases passed!",
            "total_answer": len(test_data),
            "passed_test_case": passed_test_case,
        }
    print(response_body)

def run_tests_final(test_data):
    time_start = time.time()
    port = generate_random_port()
    image_tag = generate_random_tag()
    build_success, data = build_image(port, image_tag)

    if(not build_success):
        print(data)
        return
    
    time.sleep(5)

    passed_test_case = []
    for idx, test in enumerate(test_data):
        checking_method = test['checking_method']
        url = test['url']
        url = url.replace("(port)", str(port))
        header = test['header']
        method = test['method']
        body = test['body']
        expected = test['expected']
        
        if checking_method(body, url, header, method, expected):
            passed_test_case.append(idx + 1)

    delete_containers_and_images_by_name(image_tag)
    end_time = time.time()

    if len(passed_test_case) == 0:
        response_body = {
            "message": "No test cases passed, possible Error",
            "execution_duration": f'{end_time - time_start:.2f}s'
        }
    elif len(passed_test_case) != len(test_data):
        response_body = {
            "message": "Not all test cases passed, perhaps wrong logic or runtime error",
            "total_answer": len(test_data),
            "passed_test_case": passed_test_case,
            "execution_duration": f'{end_time - time_start:.2f}s'
        }
    else:
        response_body = {
            "message": "All test cases passed!",
            "total_answer": len(test_data),
            "passed_test_case": passed_test_case,
            "execution_duration": f'{end_time - time_start:.2f}s'
        }
    print(response_body)