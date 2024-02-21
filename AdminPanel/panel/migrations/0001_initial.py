# Generated by Django 4.2.4 on 2023-08-22 08:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CompanyModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.IntegerField()),
                ('company_name', models.CharField(max_length=255)),
                ('owner', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('owner_name', models.CharField(max_length=255)),
                ('commission_rate', models.FloatField()),
                ('phone', models.CharField(max_length=14)),
                ('status', models.IntegerField()),
            ],
            options={
                'db_table': 'company',
            },
        ),
    ]
