import os


def getCompaniesUploadedFiles(companyName, folder_path):
    files = []
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            file_size = os.path.getsize(file_path)
            files.append({
                'name': filename,
                'path': file_path,
                'size': file_size,
                'company': companyName
            })
    return files

def getBankReportFiles(folder_path):
    files = []
    id = 0
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            id = id + 1
            file_size = os.path.getsize(file_path)
            files.append({
                'id': id,
                'name': filename,
                'path': 'bank_reports/'+filename,
                'size': file_size,
            })
    return files
