from celery import shared_task
from django.conf import settings
import paramiko
from .excel import getReportExcelWorkbook
from datetime import datetime
import io
from django.http import HttpResponse, Http404


@shared_task
def sendBankReport(request):
    workbook = getReportExcelWorkbook()
    output = io.BytesIO()
    workbook.save(output)
    output.seek(0)
    remote_directory = '/home/'
    transport = paramiko.Transport(
        (settings.BANK_SFTP_HOST, settings.BANK_SFTP_PORT))
    transport.connect(username=settings.BANK_SFTP_USERNAME,
                      password=settings.BANK_SFTP_PASSWORD)
    sftp = paramiko.SFTPClient.from_transport(transport)

    remote_filename = f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.xlsx"
    remote_path = f"{remote_directory}/{remote_filename}"
    with sftp.file(remote_path, 'wb') as remote_file:
        remote_file.write(output.read())
    sftp.close()
    transport.close()
    return HttpResponse("Task successfully completed")
