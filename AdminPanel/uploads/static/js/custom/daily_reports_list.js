$(document).ready(function (event) {

    var csrfToken = $('meta[name=csrf-token]').attr('content');

    $('#sendReportFile').click(function (e) {

        $.ajax({
            url: 'bank-report-file/',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                //alert(response);
                console.log(response);
                location.reload()
            },
            error: function (error) {
                alert(error);
                console.log(error);
            }
        });

    });

    $('.downloadFile').click(function () {
        var filename = $(this).data('filename');
        downloadFile(filename);
    });

    $('.deleteFile').click(function () {
        var filename = $(this).data('filename');
        deleteFile(filename);
    });

    function downloadFile(filename) {
        console.log('Downloading file')
        var downloadUrl = "bank-report-file/" + filename + '/';
        $.ajax({
            url: "bank-report-file/" + filename + '/',
            method: "GET",
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                var anchor = document.createElement('a');
                anchor.style.display = 'none';
                anchor.href = downloadUrl;
                anchor.setAttribute('download', filename);
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                console.log(response);
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function deleteFile(filename) {


        $.ajax({
            url: "bank-report-file/" + filename + '/',
            method: "DELETE",
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                console.log(response);
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

});


