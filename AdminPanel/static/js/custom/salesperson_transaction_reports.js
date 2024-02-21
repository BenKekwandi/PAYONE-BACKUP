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
            console.error('Error:', error);
        }
    });


    $.ajax({
        url: 'salesperson',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var selectElement = $('#salesperson');
            response.forEach(function (salesperson) {
                var optionText = salesperson.name + ' ' + salesperson.surname;
                var option = $('<option>').val(salesperson.id).text(optionText);
                selectElement.append(option);
            });
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });

    $('#company').change(function () {
        var selectedCompanyID = $(this).val();
        if (selectedCompanyID == 0) {
            $.ajax({
                url: 'salesperson',
                type: 'GET',
                contentType: 'application/json',
                success: function (response) {
                    var selectElement = $('#salesperson');
                    selectElement.empty();
                    $('#salesperson').append($('<option>', {
                        value: 0,
                        text: 'All'
                    }));
                    response.forEach(function (salesperson) {
                        var optionText = salesperson.name + ' ' + salesperson.surname;
                        var option = $('<option>').val(salesperson.id).text(optionText);
                        selectElement.append(option);
                    });
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });
        }
        else {
            $.ajax({
                url: 'salesperson-company/' + selectedCompanyID,
                type: 'GET',
                contentType: 'application/json',
                success: function (response) {
                    var selectElement = $('#salesperson');
                    selectElement.empty();
                    $('#salesperson').append($('<option>', {
                        value: 0,
                        text: 'All'
                    }));
                    $.each(response, function (index, salesperson) {
                        $('#salesperson').append($('<option>', {
                            value: salesperson.id,
                            text: salesperson.name
                        }));
                    });
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });
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
            url: 'transaction-action/' + id,
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json', // Set the content type to JSON
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                console.log(response);
                //location.reload();
            },
            error: function (error) {
                console.log(error);
                location.reload()
            }
        });

    }


    // Filtering


    $('#filterBtn').click(function (event) {

        var company_id = $('#company').val()
        var coin = $('#coin').val()
        var status = $('#status').val()
        var salesperson_id = $('#salesperson').val()
        var start_date = $('#startDate').val()
        var end_date = $('#endDate').val()

        if (!start_date) {

            start_date = '2022-09-08'
        }
        if (!end_date) {
            end_date = new Date();
            var year = end_date.getFullYear();
            var month = (end_date.getMonth() + 1).toString().padStart(2, '0');
            var day = end_date.getDate().toString().padStart(2, '0');
            var formattedDate = `${year}-${month}-${day}`;
            end_date = formattedDate
        }

        var url = 'transaction-query/?company_id=' + company_id + '&coin=' + coin + '&status=' + status + '&salesperson_id=' + salesperson_id + '&start_date=' + start_date + '&end_date=' + end_date;

        event.preventDefault();
        //alert('Filtered');
        $.ajax({
            url: url,
            type: "get",
            error: function (error) {
                console.log(error);
            },
            success: function (array) {
                console.log("Data is here:", array)
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {

                    var commissionTypeId = array[i].commission_type_id
                    var status = array[i].transaction_status;
                    dataTime = new Date(parseInt(array[i].start_timestamp));
                    var received_crypto = array[i].received_crypto;
                    if(array[i].received_crypto==null){
                        received_crypto = 0;
                    }
                    var expected_crypto = array[i].expected_crypto;
                    var received_amount = 0;
                    var received_nocommission = 0;
                    var received_fullamount = 0;
                    if(array[i].received_crypto!=null)
                    {
                        received_nocommission = array[i].received_crypto * array[i].exchange_rate;
                        received_amount = array[i].received_crypto * array[i].exchange_rate;
                        received_fullamount = array[i].received_crypto * array[i].exchange_rate;
                        received_amount *= (parseFloat(array[i].commission_rate) / 100)
                        received_fullamount -= received_amount
                    }

                    // var formattedExchangeRate = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2, }).format(array[i].exchange_rate)
                    var formattedExchangeRate = array[i].exchange_rate;
                    // var formattedreceived_nocommission = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2, }).format(received_nocommission)
                    var formattedreceived_nocommission = received_nocommission
                    // var formattedreceived_commission = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2, }).format(received_amount)
                    var formattedreceived_commission = (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))

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
                            // received_fullamount = array[i].expected_amount
                        }
                        else {
                            status = '<span><i class="la la-check-circle-o text-danger text-center fs-3"></i></span>'
                            received_crypto = '<span class="text-danger">' + array[i].received_crypto + '</span>'
                            expected_crypto = '<span class="text-danger">' + array[i].expected_crypto + '</span>'
                            plainStatus = 'SUCCESS';
                        }
                    }

                    var expected_amount = parseFloat(array[i].expected_amount)
                    var payment_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                    var total_crypto = parseFloat(array[i].expected_crypto) + (parseFloat(array[i].expected_crypto) * (parseFloat(array[i].commission_rate) / 100));
                    var commission_amount = (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))

                    var commissionTypeId = array[i].commission_type_id;

                    var cType = ''

                    if (commissionTypeId == 1) {
                        payment_amount = parseFloat(array[i].expected_amount) - (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                        expected_amount = parseFloat(array[i].expected_amount)
                        cType = 'bayi-ödeyecek'
                    }
                    else if (commissionTypeId == 2) {
                        payment_amount = parseFloat(array[i].expected_amount)
                        expected_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                        cType = 'müşteri-ödeyecek'
                    }


                    if(array[i].received_crypto==null){
                        received_fullamount = 0;
                    }

                    console.log("received Full Amount",received_fullamount)
          
                    var formattedreceived_fullamount = received_fullamount

                    console.log("formatted received Full Amount",formattedreceived_fullamount)
                    
                    var dateTime = array[i].insert_timestamp;

                    if(dateTime == null){
                        dateTime =' '
                    }
                    
                    var totalAmount = array[i].received_crypto*array[i].exchange_rate;

                    dataSet.push([
                        array[i].id,
                        array[i].company,
                        array[i].salesperson,
                        array[i].transaction_date,
                        array[i].insert_timestamp,
                        expected_crypto,
                        received_crypto,
                        array[i].coin,
                        totalAmount,
                        cType,
                        array[i].expected_amount,
                        payment_amount,
                        array[i].commission_rate + '%',
                        commission_amount,
                        formattedExchangeRate,
                        status + '<span style="display:none;">' + plainStatus + '</span>',

                    ]);
                }
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        });
    });

    $('#resetBtn').click(function (event) {
        event.preventDefault();
        location.reload();

    });

    var table = $('#transactionReport').DataTable({
        responsive: true,
        scrollX: 200,
        dom: '<"top"fB>rt<"bottom"lip>',
        order: [[3, 'desc']],
        buttons: [
            {
                extend: 'copy',
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
        order: [[0, 'desc']],
        ajax: {
            url: 'transaction',
            type: 'get',
            error: function (response) {
                console.log(response);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {

                    var commissionTypeId = array[i].commission_type_id
                    var status = array[i].transaction_status;
                    dataTime = new Date(parseInt(array[i].start_timestamp));
                    var received_crypto = array[i].received_crypto;
                    var expected_crypto = array[i].expected_crypto;
                    var received_amount = array[i].received_crypto * array[i].exchange_rate;
                    var received_nocommission = array[i].received_crypto * array[i].exchange_rate
                    var received_fullamount = array[i].received_crypto * array[i].exchange_rate;
                    received_amount *= (parseFloat(array[i].commission_rate) / 100)
                    received_fullamount -= received_amount
                    // var formattedExchangeRate = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2, }).format(array[i].exchange_rate)
                    var formattedExchangeRate = array[i].exchange_rate;
                    // var formattedreceived_nocommission = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2, }).format(received_nocommission)
                    var formattedreceived_nocommission = received_nocommission
                    // var formattedreceived_commission = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2, }).format(received_amount)
                    var formattedreceived_commission = received_amount

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
                            // received_fullamount = array[i].expected_amount
                        }
                        else {
                            status = '<span><i class="la la-check-circle-o text-danger text-center fs-3"></i></span>'
                            received_crypto = '<span class="text-danger">' + array[i].received_crypto + '</span>'
                            expected_crypto = '<span class="text-danger">' + array[i].expected_crypto + '</span>'
                            plainStatus = 'SUCCESS';
                        }
                    }

                    var expected_amount = parseFloat(array[i].expected_amount)
                    var payment_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                    var total_crypto = parseFloat(array[i].expected_crypto) + (parseFloat(array[i].expected_crypto) * (parseFloat(array[i].commission_rate) / 100));
                    var commission_amount = (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))

                    var commissionTypeId = array[i].commission_type_id;

                    var cType = '';

                    if (commissionTypeId == 1) {
                        payment_amount = parseFloat(array[i].expected_amount) - (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                        expected_amount = parseFloat(array[i].expected_amount)
                        cType = 'bayi-ödeyecek'                    
                    }
                    else if (commissionTypeId == 2) {
                        payment_amount = parseFloat(array[i].expected_amount)
                        expected_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                        cType = 'müşteri-ödeyecek'   
                    }


                    var totalAmount = array[i].received_crypto*array[i].exchange_rate;

                    dataSet.push([
                        array[i].id,
                        array[i].company,
                        array[i].salesperson,
                        array[i].transaction_date,
                        array[i].insert_timestamp,
                        expected_crypto,
                        received_crypto,
                        array[i].coin,
                        totalAmount,
                        cType,
                        array[i].expected_amount,
                        payment_amount,
                        array[i].commission_rate + '%',
                        commission_amount,
                        formattedExchangeRate,
                        status + '<span style="display:none;">' + plainStatus + '</span>',

                    ]);
                }
                table.clear().rows.add(dataSet).draw();
            }
        }
    });

});