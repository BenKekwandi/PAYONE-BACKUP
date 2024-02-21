$(document).ready(function () {

    console.log($('#password').val());
    console.log($('#confirm_password').val());

    $('#password', '#confirm_password').change(function (e) {
        if (!validatePassword($('#password').val())) {
            e.preventDefault();
            alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)");
            return;
        }
    });
    function validatePassword(password) {
        var pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return pattern.test(password);
    }

});
