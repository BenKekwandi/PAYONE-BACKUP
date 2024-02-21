# Generated by Django 4.2.4 on 2023-09-04 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AuthLoginModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField(null=True)),
                ('identifier', models.CharField(max_length=255)),
                ('login_datetime', models.DateTimeField(auto_now_add=True)),
                ('ip_address', models.CharField(max_length=255)),
                ('user_agent', models.CharField(max_length=255)),
                ('success', models.IntegerField()),
            ],
            options={
                'db_table': 'auth_logins',
            },
        ),
        migrations.CreateModel(
            name='CompanyModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('owner_name', models.CharField(max_length=255)),
                ('commission_rate', models.FloatField()),
                ('phone', models.CharField(max_length=14)),
                ('status', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'company',
            },
        ),
        migrations.CreateModel(
            name='SalespersonModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('surname', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=14)),
                ('address', models.CharField(max_length=255)),
                ('virtual_email', models.CharField(max_length=45)),
                ('company_id', models.IntegerField()),
                ('user_id', models.IntegerField()),
                ('status', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'salesperson',
            },
        ),
        migrations.CreateModel(
            name='TransactionModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('salesperson_id', models.IntegerField()),
                ('identification', models.CharField(max_length=255)),
                ('api_trans_id', models.CharField(max_length=255, null=True)),
                ('start_timestamp', models.CharField(max_length=13, null=True)),
                ('approval_timestamp', models.CharField(max_length=13, null=True)),
                ('insert_timestamp', models.CharField(max_length=13, null=True)),
                ('expected_amount', models.FloatField()),
                ('expected_crypto', models.FloatField()),
                ('commission_rate', models.FloatField()),
                ('received_crypto', models.FloatField(null=True)),
                ('banknote', models.CharField(max_length=4)),
                ('exchange_rate', models.FloatField()),
                ('coin', models.CharField(max_length=10)),
                ('address', models.CharField(max_length=255)),
                ('network', models.CharField(max_length=3, null=True)),
                ('api_status', models.IntegerField(null=True)),
                ('payone_status', models.IntegerField(default=0)),
                ('transaction_status', models.IntegerField(default=0)),
                ('payed', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'transaction',
            },
        ),
    ]