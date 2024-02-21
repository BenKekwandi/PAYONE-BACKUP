$(document).ready(function () {
    $.ajax({
        url: 'log-history',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            // console.log(response)

            if (Array.isArray(response) && response.length > 0) {

                var lastLog = response[response.length - 2].login_datetime;
                var formattedlog = moment(lastLog).format('YYYY-MM-DD HH:mm:ss');

                $('#last_login').val(formattedlog);
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });

});