from django.contrib import admin
from .models import SalespersonModel
from .models import CompanyModel
from .models import EmployeeModel
from .models import ManagerModel
from .models import TransactionModel
from .models import BankOperatorModel


admin.site.register(CompanyModel)
admin.site.register(ManagerModel)
admin.site.register(EmployeeModel)
admin.site.register(TransactionModel)
admin.site.register(BankOperatorModel)
admin.site.register(SalespersonModel)
