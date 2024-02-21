$(document).ready(function () {
    const csrfToken = $('meta[name=csrf-token]').attr('content');

    $.ajax({
        url: 'company',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var selectElement = $('#company');
            response.forEach(function (company) {
                var optionText = company.company_name;
                var option = $('<option>').val(company.id).text(optionText);
                selectElement.append(option);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
    $(document).on('click', '.accept-btn', function (event) {
        event.preventDefault();
        var id = $(this).data('action');
        var value = 1;
        $('#acceptModal #acceptSubmit').click(function () {
            actionTransaction(id, value)
        })
    });
    $(document).on('click', '.reject-btn', function (event) {
        event.preventDefault();
        var id = $(this).data('action');
        var value = -1;
        $('#rejectModal #rejectSubmit').click(function () {
            actionTransaction(id, value)
        })
    });

    function actionTransaction(id, value) {
        var data = {
            'id': id,
            'value': value,
        };
        $.ajax({
            url: 'transaction-action',
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json', // Set the content type to JSON
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


    var dataTime;
    var table = $('#transactionReport').DataTable({
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
            url: 'transaction',
            type: 'get',
            error: function (response) {
                console.log(response);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {

                    var status = array[i].transaction_status;
                    dataTime = new Date(parseInt(array[i].start_timestamp));
                    var newdataTime = new Date(parseInt(array[i].insert_timestamp));
                    var options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                    var received_crypto = array[i].received_crypto;
                    var expected_crypto = array[i].expected_crypto;
                    var plainStatus = '';
                    if (status === 0) {
                        status = '<span><i class="la la-warning text-warning text-center fs-3"></i></span>';
                        plainStatus = 'PENDING';

                    } else if (status === -1) {
                        status = '<span><i class="la la-times text-danger text-center fs-3"></i></span>'
                        plainStatus = 'CANCELLED';


                    } else {
                        if (array[i].expected_crypto === array[i].received_crypto) {
                            status = '<span><i class="la la-check-circle-o text-success text-center fs-3"></i></span>'
                            received_crypto = '<span class="text-success">' + array[i].received_crypto + '</span>'
                            expected_crypto = '<span class="text-success">' + array[i].expected_crypto + '</span>'
                        }
                        else {
                            status = '<span><i class="la la-check-circle-o text-danger text-center fs-3"></i></span>'
                            received_crypto = '<span class="text-danger">' + array[i].received_crypto + '</span>'
                            expected_crypto = '<span class="text-danger">' + array[i].expected_crypto + '</span>'
                            plainStatus = 'SUCCESS';
                        }
                    }
                    dataSet.push([
                        //i + 1,
                        array[i].id,
                        array[i].company,
                        array[i].salesperson,
                        //array[i].transaction_id,
                        array[i].transaction_date,
                        array[i].insert_timestamp,
                        expected_crypto,
                        received_crypto,
                        array[i].coin,
                        array[i].expected_amount + ' ' + array[i].banknote,
                        array[i].network,
                        array[i].commission_rate + '%',
                        status + '<span style="display:none;">' + plainStatus + '</span>',
                        '<a data-bs-toggle="modal" data-bs-target="#acceptModal" data-action="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md accept-btn" title="Accept details">\
                        <i class="la la-check-circle-o"></i></a>'+ '<a data-bs-toggle="modal" data-bs-target="#rejectModal" data-action="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md reject-btn" title="Reject">\
                        <i class="la la-times"></i></a>',

                    ]);
                }
                table.clear().rows.add(dataSet).draw();
            }
        }
    });

    var submitButton = $('#submitBtn');

    submitButton.click(function (e) {
        e.preventDefault();
        companyId = $("#company").val()
        if (companyId === "") {
            var url = 'transaction';
        }
        else {
            url = 'transaction-company/' + companyId
        }
        $.ajax({
            url: url,
            type: 'get',
            error: function (response) {
                console.log(response);
            },
            success: function (array) {
                console.log(array)
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {

                    var status = array[i].transaction_status;
                    dataTime = new Date(parseInt(array[i].start_timestamp));
                    var newdataTime = new Date(parseInt(array[i].insert_timestamp));
                    var options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                    var startDate = dataTime.toLocaleString('en-GB', options);
                    var receivedDate = newdataTime.toLocaleString('en-GB', options);
                    var plainStatus = '';
                    if (receivedDate === 'Invalid Date') {
                        receivedDate = ''
                    }
                    if (status === '0') {
                        status = '<span class="btn btn-warning btn-sm text-white"><i class="fas fa-info"></i></span>'
                        plainStatus = 'Pending';
                    } else if (status === '-1') {
                        status = '<span class="btn btn-danger btn-sm"><i class="fas fa-xmark"></i></span>'
                        plainStatus = 'Cancelled'

                    } else {
                        status = '<span ><i class="la la-check-circle-o text-success text-center fs-3"></i></span>'
                        plainStatus = "Success";
                    }
                    dataSet.push([
                        array[i].company,
                        array[i].salesperson,
                        array[i].transaction_date,
                        array[i].insert_timestamp,
                        array[i].expected_crypto,
                        array[i].received_crypto,
                        array[i].coin,
                        array[i].expected_amount + ' ' + array[i].banknote,
                        array[i].network,
                        array[i].commission_rate,
                        status + '<span style="display:none;">' + plainStatus + '</span>',

                    ]);
                }
                table.clear().rows.add(dataSet).draw();
            }
        });

    });

});