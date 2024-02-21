#!/var/www/venv/bin/python

activate_this = '/var/www/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))
    
import configparser
from datetime import datetime
import os
from ftplib import FTP
import zipfile
import io
from django.core.mail import send_mail
from django.conf import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

# config = configparser.ConfigParser()
# config.read('/var/www/config.ini')

ftp_config = {
    "host": '185.198.197.46',
    "port": 60300,
    "user": 'arekan',
    "password": 'WelcomeA---2023..Rekan3'
}   

def send_zip_to_ftp(local_folders, ftp_config, name):
    ftp = FTP()
    ftp.connect(ftp_config['host'], ftp_config['port'])
    ftp.login(ftp_config['user'], ftp_config['password'])
    zipFile = f"ubuntu/backups/{name}.zip"
    zip_buffer = io.BytesIO() 
    try:
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for local_folder in local_folders:
                for root, _, files in os.walk(local_folder):
                    for file in files:
                        local_file_path = os.path.join(root, file)
                        remote_file_path = os.path.join(zipFile, os.path.relpath(local_file_path, local_folder))
                        zipf.write(local_file_path, remote_file_path)
        zip_buffer.seek(0)
        ftp.storbinary(f'STOR {zipFile}', zip_buffer)
        msg = f"Uploaded zip file: {zipFile}"
        print(msg)
    except Exception as e:
        print(f"Error: {e}")
    ftp.quit()
print('FTP...')

folders = ['/var/www/','/var/lib/mysql','/etc/nginx/sites-available/','/etc/apache2/sites-available/','/etc/phpmyadmin/']

send_zip_to_ftp(folders,ftp_config,f"BACK_UP-{datetime.now().strftime('%m-%d-%Y %H-%M-%S')}")

emailMessage = f"BACKUP DATE AND TIME: {datetime.now().strftime('%Y-%m-%d %H-%M-%S')}\n"
subject = 'PAYONE SERVER BACKUP'
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
server = smtplib.SMTP(smtp_server, smtp_port)
server.login(sender_email, sender_password)
server.sendmail(sender_email,recipients, message.as_string())
server.quit()
