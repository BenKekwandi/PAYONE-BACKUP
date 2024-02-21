from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.conf import settings
import os
from django.http import HttpResponse, Http404
from django.http import FileResponse, JsonResponse
import paramiko
import io
from datetime import datetime
from stat import S_ISREG
from .excel import getReportExcelWorkbook
from .models import *
import pandas as pd
from .excel import getWorkbook
from django.forms.models import model_to_dict


ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'jpg', 'jpeg'}

class CompanyFile(LoginRequiredMixin, APIView):
    def get(self, request, fileName, companyId, *args, **kwargs):
        file_path = os.path.join(
            settings.BASE_DIR, 'uploads/companies/company-', companyId, fileName)
        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                response = HttpResponse(
                    file.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{fileName}"'
                print(response)
                return response
        else:
            pass

    def delete(self, request, fileName, companyId, *args, **kwargs):
        file_path = os.path.join(
            settings.BASE_DIR, 'uploads/companies/company-' + companyId+'/'+fileName)
        if os.path.exists(file_path):
            os.remove(file_path)
            return JsonResponse({'message': 'File deleted successfully'})
        else:
            return JsonResponse({'error': 'File not found'}, status=404)
        
    def is_allowed_extension(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class BankReportFile(APIView):
    def post(self, request, *args, **kwargs):
        workbook = getReportExcelWorkbook()
        output = io.BytesIO()
        internal_output = io.BytesIO()
        workbook.save(output)
        workbook.save(internal_output)
        output.seek(0)
        internal_output.seek(0)
        remote_directory = '/home/'
        remote_filename = f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.xlsx"
        folder_path = os.path.join(settings.BASE_DIR, 'uploads/bank_reports/')
        with open(folder_path+remote_filename, 'wb+') as destination:
            destination.write(internal_output.read())
        transport = paramiko.Transport(
            (settings.BANK_SFTP_HOST, settings.BANK_SFTP_PORT))
        transport.connect(username=settings.BANK_SFTP_USERNAME,
                          password=settings.BANK_SFTP_PASSWORD)
        sftp = paramiko.SFTPClient.from_transport(transport)
        remote_path = f"{remote_directory}/{remote_filename}"
        with sftp.file(remote_path, 'wb+') as remote_file:
            remote_file.write(output.read())
        sftp.close()
        transport.close()
        return HttpResponse("File successfully uploaded")


class BankReportFileDetail(LoginRequiredMixin, APIView):
    def get(self, request, fileName, *args, **kwargs):
        file_path = os.path.join(
            settings.BASE_DIR, 'uploads/bank_reports/'+ fileName)
        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                response = HttpResponse(
                    file.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{fileName}"'
                print(response)
                return response
        else:
            pass

    def delete(self, request, fileName,*args, **kwargs):
        file_path = os.path.join(
            settings.BASE_DIR, 'uploads/bank_reports/'+fileName)
        if os.path.exists(file_path):
            os.remove(file_path)
            return JsonResponse({'message': 'File deleted successfully'})
        else:
            return JsonResponse({'error': 'File not found'}, status=404)
        

class BankReportTxt(LoginRequiredMixin, APIView):
    def excel_to_txt(excel_file, txt_file):
        df = pd.read_excel(excel_file)
        txt_content = df.to_csv(sep='\t', index=False)
        return txt_content
    
    def get(self, request, fileName, *args, **kwargs):
        file_path = os.path.join(
            settings.BASE_DIR, 'uploads/bank_reports/'+fileName)
        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                f = self.excel_to_txt(file)
                response = HttpResponse(
                    f.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{fileName}"'
                print(response)
                return response
            
def transactionList():
    start_date = datetime.datetime(2023, 1, 1)
    end_date = datetime.datetime.now().date()
    step = datetime.timedelta(days=1)
    current_date = start_date.date()
    transactions = TransactionModel.objects.filter(transaction_status=1)
    tr = []
    while current_date <= end_date:
        l = [transaction.id for transaction in transactions
             if datetime.datetime.fromtimestamp(float(transaction.start_timestamp)).date() == current_date]
        if l:
            ts = {
                'date': current_date.strftime('%d-%m-%Y'),
                'transactions': l
            }
            tr.append(ts)
        current_date += step   
    return tr

def transactionExcel(request, date):
    items = transactionList()
    trIds = []
    flag=0
    for item in items:
        if date == item["date"]:
            flag = 1
            for trItem in item["transactions"]:
                trIds.append(trItem)
    if flag != 0:
        data = []
        for trId in trIds:
            transaction = TransactionModel.objects.get(id=trId)
            data.append(model_to_dict(transaction))        
    newData = []
    for item in data:
        newItem = {
            "Hesap No":CompanyModel.objects.get(id=item['company_id']).bank_account_no,
            "Alıcı Ünvanı":CompanyModel.objects.get(id=item['company_id']).company_name,
            "Ödeme Tutarı":item['expected_amount'],
            "Para Birimi":item['banknote']
        }
        if item['commission_type_id']==1:
            newItem['Ödeme Tutarı'] = item['expected_amount'] - (item['expected_amount']*item['commission_rate']*0.01)
        elif item['commission_type_id']==2:
            newItem['Ödeme Tutarı'] = item['expected_amount']
        transTime = datetime.datetime.strptime(item['insert_timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')
        newItem['Açıklama'] = f"Ref:{item['id']}, {transTime.strftime('%Y-%m-%d %H:%M:%S')}"
        newData.append(newItem)
    wb = getWorkbook(newData)
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f"attachment; filename={date}.xlsx"
    wb.save(response)
    return response

def transactionTxt(request,date):
    items = transactionList()
    trIds = []
    flag = 0
    for item in items:
        if date == item["date"]:
            flag = 1
            for trItem in item["transactions"]:
                trIds.append(trItem)
    if flag != 0:
        data = []
        for trId in trIds:
            transaction = TransactionModel.objects.get(id=trId)
            data.append(model_to_dict(transaction))
    
    new_data = []
    for item in data:
        new_item = {
            "Hesap No":CompanyModel.objects.get(id=item['company_id']).bank_account_no,
            "Alıcı Ünvanı":CompanyModel.objects.get(id=item['company_id']).company_name,
            "Ödeme Tutarı": f"{item['expected_amount']:018.2f}",
            "Para Birimi":item['banknote'],
        }
        if item['commission_type_id']==1:
            new_item['Ödeme Tutarı'] = item['expected_amount'] - (item['expected_amount']*item['commission_rate']*0.01)
        elif item['commission_type_id']==2:
            new_item['Ödeme Tutarı'] = item['expected_amount']
        new_item['Ödeme Tutarı'] = f"{new_item['Ödeme Tutarı']:018.2f}"
        trans_time = datetime.datetime.strptime(item['insert_timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')
        new_item['Açıklama'] = f"{trans_time.strftime('%d.%m.%Y')} Ref:{item['id']}"
        new_data.append(new_item)
        
    txt_content ='' 
    for item in new_data:
        txt_content += f"{item['Hesap No'][:8]:<8}"
        txt_content += f"{item['Alıcı Ünvanı'][:30]:<30}"
        txt_content += f"{str(item['Ödeme Tutarı'])[:18]:<18}"
        txt_content += f"{item['Para Birimi'][:3]:<3}"
        txt_content += f"{item['Açıklama'][:40]:<40}\n"
    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = f"attachment; filename={date}.txt"
    response.write(txt_content)
    return response