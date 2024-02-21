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
    """
    cursor.execute(qry)
    data = cursor.fetchall()
    transactions = []
    cursor.close()
    connection.close()
    return