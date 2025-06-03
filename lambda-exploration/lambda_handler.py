import json
import os
import sys


def list_all_files(directory):
    file_list = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_list.append(file_path)
    return file_list


def list_all_directories(directory, exclude_path="/var/lang"):
    folder_list = []
    for root, dirs, files in os.walk(directory):
        # Normalize and exclude /var/lang and subdirectories
        dirs[:] = [
            d
            for d in dirs
            if os.path.join(root, d) != exclude_path
            and not os.path.join(root, d).startswith(exclude_path + os.sep)
        ]

        for d in dirs:
            folder_path = os.path.join(root, d)
            folder_list.append(folder_path)
    return folder_list


def lambda_handler(event, context):
    print("current directory: " + os.getcwd())
    print("sys: " + str(sys.argv))
    print("sys.path: " + str(sys.path))
    print("os.environ: " + str(os.environ))

    print(json.dumps(event, indent=2))
    all_files = list_all_directories("/")
    for file in all_files:
        print(file)
    # TODO implement
    return {"statusCode": 200, "body": json.dumps("Hello from Lambda!")}
