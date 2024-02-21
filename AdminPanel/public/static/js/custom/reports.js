$(document).ready(function (event) {

    var csrfToken = $('meta[name=csrf-token]').attr('content');

    $('#daily_report_list').DataTable({
        responsive: true,
        scrollX: 200,
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[0, 'desc']],
        //dom: 'Bfrtip',
        // buttons: [
        //     {
        //         extend: 'copy',
        //         className: 'btn'
        //     },
        //     {
        //         extend: 'excel',
        //         className: 'btn'
        //     },
        //     {
        //         extend: 'print',
        //         className: 'btn'
        //     }
        // ],
    })

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
                // console.log(response);
                location.reload()
            },
            error: function (error) {
                // alert(error);
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

    $('.txtFile').click(function () {
        var filename = $(this).data('filename');
        txtFile(filename);
    });

    function txtFile(filename) {
        // console.log('Downloading file')
        var downloadUrl = "bank-report-txt-file/" + filename + '/';
        $.ajax({
            url: "bank-report-txt-file/" + filename + '/',
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
                //location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function downloadFile(filename) {
        // console.log('Downloading file')
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
                // console.log(response);
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
                // console.log(response);
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

});


