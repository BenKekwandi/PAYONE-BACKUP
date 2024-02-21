$(document).ready(function () {
    var csrfToken = $('meta[name=csrf-token]').attr('content');
    var companyId = $('#companyId').val();
    var company = $('#company').val();



    $('#fileUploadSubmit').click(function () {
        var contract_file = $('#contract_file')[0].files[0];
        var application_form_file = $('#application_form_file')[0].files[0];
        var tax_file = $('#tax_file')[0].files[0];
        var other_file = $('#other_file')[0].files[0];

        var formData = new FormData();

        if (contract_file) {
            formData.append("contract_" + contract_file.name, contract_file);
        }
        if (application_form_file) {
            formData.append("application_" +application_form_file.name, application_form_file);
        }
        if (tax_file) {
            formData.append("tax_" +tax_file.name, tax_file);
        }
        if (other_file) {
            formData.append("contract" +other_file.name, other_file);
        }

        if (formData) {
            $.ajax({
                url: 'company-details/' + companyId,  // Replace with your Django URL for handling file upload
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log(response);
                    location.reload();
                },
                error: function (error) {
                    // Handle error
                    console.log(error);
                }
            });
        }
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
        var downloadUrl = "/download-file/" + filename + '/' + company;

        // Create a hidden anchor element
        var anchor = document.createElement('a');
        anchor.style.display = 'none';
        anchor.href = downloadUrl;
        anchor.setAttribute('download', filename);

        // Append the anchor to the document
        document.body.appendChild(anchor);

        // Click the anchor to initiate the download
        anchor.click();

        // Remove the anchor from the document
        document.body.removeChild(anchor);
    }

    function deleteFile(filename) {
        $.ajax({
            url: "/delete-file/" + filename + '/' + company,
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

    var table = $('#transaction').DataTable({
        responsive: true,
        scrollX: 200,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'copy',
                className: 'btn'
            },
            {
                extend: 'csv',
                className: 'btn'
            },
            {
                extend: 'excel',
                className: 'btn'
            },
            {
                extend: 'print',
                className: 'btn'
            }
        ],
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[1, 'asc']],
        ajax: {
            url: 'transaction-company/' + companyId,
            dataType: "json",
            error: function (error) {
                console.log(error);
            },
            success: function (array) {
                console.log(array)
                var dataSet = [];

                for (var i = 0; i < array.length; i++) {
                    var dataTime = new Date(parseInt(array[i].start_timestamp));
                    var options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                    var startDate = dataTime.toLocaleString('en-GB', options);
                    payment_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                    total_crypto = parseFloat(array[i].expected_crypto) + (parseFloat(array[i].expected_crypto) * (parseFloat(array[i].commission_rate) / 100));
                    commission_amount = (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))
                    dataSet.push([
                        array[i].salesperson,
                        array[i].api_trans_id,
                        startDate,
                        array[i].network,
                        array[i].expected_amount + array[i].banknote,
                        array[i].commission_rate + '%',
                        commission_amount + array[i].banknote,
                        payment_amount + array[i].banknote,
                        '<span class="btn btn-sm"><i class="la la-check-circle-o text-success text-center fs-3"></i></span>'
                    ]);
                }

                table.clear().rows.add(dataSet).draw();
            }
        }
    });

    var salesperson_table = $('#salesperson').DataTable({
        responsive: true,
        scrollX: 200,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'copy',
                className: 'btn'
            },
            {
                extend: 'csv',
                className: 'btn'
            },
            {
                extend: 'excel',
                className: 'btn'
            },
            {
                extend: 'print',
                className: 'btn'
            }
        ],
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[1, 'asc']],

        ajax: {
            url: 'salesperson-company/' + companyId,
            dataType: "json",
            error: function (error) {
                alert(error);
                console.log(error);
            },
            success: function (array) {
                var dataSet = [];
                //  console.log(array);
                for (var i = 0; i < array.length; i++) {

                    var actions = '<button type="button" class="btn btn-outline-danger btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" data-salesperson="' + array[i].salesperson_id + '"><i class="fas fa-power-off text-center"></i></button>'
                        + '<button type="button" class="btn btn-outline-info btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editModal" data-salesperson="' + array[i].salesperson_id + '"><i class="fas fa-edit text-center"></i></button>'
                        + '<a href="salesperson-details/' + array[i].salesperson_id + '" class="btn btn-outline-success btn-sm"><i class="fa-solid fa-eye"></i></a>';

                    dataSet.push([
                        array[i].company,
                        array[i].name,
                        array[i].surname,
                        array[i].email,
                        array[i].phone,
                        array[i].address,
                    ]);
                }
                salesperson_table.clear().rows.add(dataSet).draw();
            }
        }
    });

    var filesTable = $('#fileTable').DataTable();

});