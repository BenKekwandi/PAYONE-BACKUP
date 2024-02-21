from django import template
from django.contrib.auth.models import Group

register = template.Library()


@register.filter(name='has_group')
def has_group(user, group_name):
    return user.groups.filter(name=group_name).exists()


@register.filter(name='is_internal')
def is_internal(user):
    isAdmin = user.groups.filter(name='Admin').exists()
    isOperator = user.groups.filter(name='Operator').exists()
    isBankOperator = user.groups.filter(name='BankOperator').exists()
    check = True if isAdmin or isOperator or isBankOperator else False
    return check


@register.filter(name='is_external')
def is_external(user):
    isManager = user.groups.filter(name='Manager').exists()
    isSalesperson = user.groups.filter(name='Salesperson').exists()
    check = True if isManager or isSalesperson else False
    return check
