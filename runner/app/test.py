def calculate_sum(max_num, num_list):
    total_sum = 0
    for num in num_list:
        if num <= max_num:
            total_sum += 2 ** (num - 1)
    return total_sum

def binary_to_array(max_value, binary_representation):
    number_array = []
    for i in range(max_value):
        if binary_representation & (1 << i):
            number_array.append(i + 1)
    return number_array

print(binary_to_array(10, 535))
# # Test cases
# print(calculate_sum(3, [1, 2, 3]))  # Output: 7
# print(calculate_sum(3, [1, 2]))     # Output: 3
# print(calculate_sum(3, [1, 3]))     # Output: 5
# print(calculate_sum(10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))  # Output: 1023
# print(calculate_sum(10, [1, 2, 3, 4, 6]))
# print(calculate_sum(10, [1, 2, 3, 4, 5, 6, 7, 8, 9]))

'''
docker run -d --name app_con testing-challange-app
docker run -d --name db_con testing-challange-db

docker network create my_network
docker run --name app_con --network my_network testing-challange-app
docker run --name db_con --network my_network testing-challange-db
'''