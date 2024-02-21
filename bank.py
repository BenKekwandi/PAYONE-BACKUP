#!/var/www/venv/bin/python

activate_this = '/var/www/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))
import mysql.connector
from openpyxl import Workbook
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import configparser
from openpyxl.utils import get_column_letter
from openpyxl.styles import Alignment, Border, Side, PatternFill
from openpyxl.worksheet.table import Table, TableStyleInfo
import io
from datetime import datetime
import paramiko
from stat import S_ISREG
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.base import MIMEBase
from email import encoders
from django.http import HttpResponse, Http404
from django.http import FileResponse, JsonResponse

config = configparser.ConfigParser()
config.read('/var/www/config.ini')

db_config = {
    "host": config.get('MySQL', 'host'),
    "user": config.get('MySQL', 'user'),
    "password": config.get('MySQL', 'password'),
    "database": config.get('MySQL', 'database')
}

sftp_config = {
    "host": config.get('SFTP', 'host'),
    "port": config.getint('SFTP', 'port'),
    "user": config.get('SFTP', 'user'),
    "password": config.get('SFTP', 'password')
}


def fetcher():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    qry ="""
    SELECT
        company.bank_account_no AS `Hesap No`,
        company.company_name AS `Alıcı Ünvanı`,
        transaction.expected_amount AS `Ödeme Tutarı`,
        transaction.banknote AS `Para Birimi`,
        transaction.insert_timestamp as `date`,
        transaction.id as `id`,
        transaction.commission_type_id as `commission_type_id`,
        transaction.commission_rate as `commission_rate`,
        CONCAT('Ref: ', transaction.id,', ', DATE_FORMAT(FROM_UNIXTIME(transaction.start_timestamp), '%Y-%m-%d %H:%i:%s')) AS `Açıklama`
    FROM transaction
    INNER JOIN salesperson ON transaction.salesperson_id = salesperson.id
    INNER JOIN company ON salesperson.company_id = company.id
    WHERE transaction_status = 1
    """
    cursor.execute(qry)
    data = cursor.fetchall()
    transactions = []
    cursor.close()
    connection.close()
    for row in data:
        row['Ödeme Tutarı']='{:014.2f}'.format(row['Ödeme Tutarı'])
        if datetime.strptime(row['date'],"%Y-%m-%dT%H:%M:%S.%fZ").date() == datetime.now().date():
            transactions.append(row)
    return transactions

def getTxt(date, data):
    txt_content = ''
    for item in data:
        payment_amount = 0
        if item['commission_type_id'] == 1:
            payment_amount = float(item['Ödeme Tutarı']) - (float(item['Ödeme Tutarı'])*float(item['commission_rate'])*0.01)
        elif item['commission_type_id'] == 2:
            payment_amount = float(item['Ödeme Tutarı'])
        item['Ödeme Tutarı'] = f"{payment_amount:018.2f}"
        transTime = datetime.strptime(item['date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        item['Açıklama'] = f"{transTime.strftime('%d.%m.%Y')} Ref:{item['id']}"
        txt_content += f"{item['Hesap No'][:8]:<8}"
        txt_content += f"{item['Alıcı Ünvanı'][:30]:<30}"
        txt_content += f"{item['Ödeme Tutarı'][:18]:<18}"
        txt_content += f"{item['Para Birimi'][:3]:<3}"
        txt_content += f"{item['Açıklama'][:40]:<40}\n"
    return txt_content


def sendToSftp():
    date = datetime.now().date()
    data = fetcher()
    if not data:
        print('No Transaction recorded')
        return None
    text_content = getTxt(date,data)
    bytes = text_content.encode('utf-8')
    file = io.BytesIO()
    file.write(bytes)
    #file.seek(0)
    filename = f"{date}.txt"
    remote_path="/munte/"+filename
    transport = paramiko.Transport((sftp_config['host'], sftp_config['port']))
    transport.connect(username=sftp_config['user'],password=sftp_config['password'])
    sftp = paramiko.SFTPClient.from_transport(transport)
    with sftp.file(remote_path, 'wb+') as remote_file:
        file.seek(0) 
        remote_file.write(file.read())
    sftp.close()
    transport.close()
    return file

def emailMessage(fl):
    if fl is not None:
        emailMessage = f"""
        BANK REPORT FILE SENT \n\n
        FILE NAME : {datetime.now().strftime('%d-%m-%Y')}.txt\n
        DATE AND TIME: {datetime.now().strftime('%Y-%m-%d %H-%M-%S')}\n
        """
        subject = 'BANK REPORT FILE'
        fromEmail = 'no-reply@payone.com.tr'
        recipients = ['benoitkekwandi@gmail.com','arekanteknoloji@gmail.com','ediz@scanyoursecurity.com']
        smtp_server = 'mail.enguclu.net'
        smtp_port = 587
        sender_email = 'no-reply@payone.com.tr'
        sender_password = 'Welcome1-1001'
        message = MIMEMultipart()
        message['From'] = fromEmail
        message['To'] = ', '.join(recipients)
        message['Subject'] = subject
        message.attach(MIMEText(emailMessage, 'plain'))
        file_name = f"{datetime.now().strftime('%d-%m-%Y')}.txt"
        attachment = MIMEText(fl.getvalue().decode('utf-8'))
        attachment.add_header('Content-Disposition', 'attachment', filename=file_name)
        message.attach(attachment)
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.login(sender_email, sender_password)
        server.sendmail(sender_email,recipients, message.as_string())
        server.quit()
    else:
        print("Email can't be sent, No Transaction Recorded Today")

fl = sendToSftp()
emailMessage(fl)

