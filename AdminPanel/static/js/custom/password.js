$(document).ready(function () {

    // console.log("Hey man new man");

    $('#password, #confirm_password').on('input', function () {
        var password = $('#password').val();
        var confirm_password = $('#confirm_password').val();

        if (!validatePassword(password)) {
            alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)");
        } else if (password !== confirm_password) {
            alert("Passwords do not match");
        }
    });

    function validatePassword(password) {
        var pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return pattern.test(password);
    }
});
