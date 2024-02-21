from django.urls import path
from django.contrib.auth.views import LogoutView
from .two_factor_authentication import otp, login
from .views import verify_email,check_inbox,forget_password,resetOTP,handle404
from rest_framework_simplejwt.views import TokenObtainPairView

app_name = 'auth'

urlpatterns = [
    path('2fa-login/', login),
    path('2fa-otp/', otp),
    path('logout/', LogoutView.as_view()),
    path('email/', verify_email),
    path('inbox/', check_inbox),
    path('2fa-reset-otp/<str:token>/', resetOTP),
    path('forget-password/<str:token>/',forget_password, name="forget_password"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('404/', handle404),
    path('login/', login),

    
]
