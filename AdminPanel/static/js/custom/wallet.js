$(document).ready(function () {

    if ($('#userGroup').val() == 'Admin') {
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
    }
    else if ($('#userGroup').val() == 'Manager') {
        var companyID = $('#companyId').val();
        $.ajax({
            url: 'company/' + companyID,
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                var selectElement = $('#company');
                selectElement.empty();
                var optionText = response.company_name;
                var option = $('<option>').val(response.id).text(optionText);
                selectElement.append(option);
                selectElement.prop('readonly', true);
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
        $.ajax({
            url: 'salesperson-company/' + companyID,
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

    var requestUrl = '';
    if (($('#userGroup').val() === 'Manager')) {
        requestUrl = 'transaction-company/' + $('#companyId').val();
    }
    else {
        requestUrl = 'transaction';
    }


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
                var dataSet = [];
                var commissionTypeId = '';
                for (var i = 0; i < array.length; i++) {
                    $.ajax({
                        url: 'company/' + array[i].company_id,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (response) {
                            console.log('single company ' + response.company_name, response);
                            console.log('Before: ', response.commission_type_id)
                            commissionTypeId = response.commission_type_id;
                            console.log('After: ', commissionTypeId)
                        },
                        error: function (error) {
                            console.error('Error:', error);
                        }
                    });
                    var plainStatus = 'success';
                    var status = ''
                    if (array[i].transaction_status == 1) {
                        plainStatus = 'Success'
                        status = '<span ><i class="la la-check-circle-o text-success text-center fs-3"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>';
                    }
                    else if (array[i].transaction_status == 0) {
                        plainStatus = 'Pending'
                        status = '<span ><i class="fa-regular fa-clock text-warning text-center fs-3"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>';
                    }
                    else if (array[i].transaction_status == -1) {
                        plainStatus = 'Cancelled'
                        status = '<span ><i class="fa-solid fa-ban text-danger text-center fs-3"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>';
                    }
                    var cType = ''
                    expected_amount = parseFloat(array[i].expected_amount)
                    payment_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                    total_crypto = parseFloat(array[i].expected_crypto) + (parseFloat(array[i].expected_crypto) * (parseFloat(array[i].commission_rate) / 100));
                    commission_amount = (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))

                    var commissionTypeId = array[i].commission_type_id;

                    if (commissionTypeId == 1) {
                        payment_amount = parseFloat(array[i].expected_amount) - (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                        expected_amount = parseFloat(array[i].expected_amount)
                        cType = 'bayi-ödeyecek/retailer-pays'
                    }
                    else if (commissionTypeId == 2) {
                        payment_amount = parseFloat(array[i].expected_amount)
                        expected_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                        cType = 'müşteri-ödeyecek/customer-pays'
                    }

                    if ($('#userGroup').val() == 'Manager') {
                        dataSet.push([
                            array[i].transaction_date,
                            array[i].company,
                            array[i].salesperson,
                            array[i].id,
                            array[i].expected_amount,
                            array[i].banknote,
                            '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>'
                        ]);
                    }
                    else {
                        dataSet.push([
                            //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                            array[i].transaction_date,
                            array[i].company,
                            array[i].salesperson,
                            array[i].id,
                            // array[i].network,
                            array[i].expected_crypto + ' ' + array[i].coin,
                            array[i].received_crypto + ' ' + array[i].coin,
                            cType,
                            array[i].expected_amount,
                            expected_amount,
                            array[i].commission_rate + '%',
                            commission_amount,
                            payment_amount + ' ' + array[i].banknote,
                            status
                        ]);
                    }
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

    var table = $('#transactions').DataTable({
        responsive: true,
        //scrollX: 200,
        dom: '<"top"fB>rt<"bottom"lip>',
        order: [[3, "desc"]],
        buttons: [
            {
                extend: 'copy',
                className: 'btn'
            },
            {
                extend: 'excel',
                className: 'btn'
            },
            // {
            //     extend: 'pdf',
            //     className: 'btn'
            // },
            {
                extend: 'print',
                className: 'btn'
            }
        ],
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[3, 'desc']],
        ajax: {
            url: 'transaction',
            dataType: "json",
            error: function (error) {
                alert("Error " + error);
                console.log(error);
            },
            success: function (array) {
                var dataSet = [];

                for (var i = 0; i < array.length; i++) {

                    var plainStatus = 'success';

                    var status = ''
                    if (array[i].transaction_status == 1) {
                        plainStatus = 'Success'
                        status = '<span ><i class="la la-check-circle-o text-success text-center fs-3"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>';
                    }
                    else if (array[i].transaction_status == 0) {
                        plainStatus = 'Pending'
                        status = '<span ><i class="fa-regular fa-clock text-warning text-center fs-3"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>';
                    }
                    else if (array[i].transaction_status == -1) {
                        plainStatus = 'Cancelled'
                        status = '<span ><i class="fa-solid fa-ban text-danger text-center fs-3"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>';
                    }
                    var cType=''
                    expected_amount = parseFloat(array[i].expected_amount)
                    payment_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                    total_crypto = parseFloat(array[i].expected_crypto) + (parseFloat(array[i].expected_crypto) * (parseFloat(array[i].commission_rate) / 100));
                    commission_amount = (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))
                    var received_amount = array[i].received_crypto * array[i].exchange_rate;
                    var received_commission = array[i].received_crypto * array[i].exchange_rate;
                    var received_payment = array[i].received_crypto * array[i].exchange_rate;
                    if (array[i].expected_crypto != array[i].received_crypto) {
                        received_amount -= commission_amount
                    }
                    received_amount *= (parseFloat(array[i].commission_rate) / 100)


                    received_commission += received_amount
                    var received_nocommission = array[i].received_crypto * array[i].exchange_rate;
                    received_nocommission -= received_amount;

                    var commissionTypeId = array[i].commission_type_id;

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


                    if ($('#userGroup').val() == 'Manager') {
                        dataSet.push([
                            //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                            array[i].transaction_date,
                            array[i].salesperson,
                            array[i].id,
                            array[i].expected_amount,
                            array[i].banknote,
                            '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>'
                        ]);
                    }
                    else {

                        dataSet.push([
                            //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                            array[i].transaction_date,
                            array[i].company,
                            array[i].salesperson,
                            array[i].id,
                            // array[i].network,
                            array[i].expected_crypto + ' ' + array[i].coin,
                            array[i].received_crypto + ' ' + array[i].coin,
                            cType,
                            array[i].expected_amount,
                            expected_amount,
                            array[i].commission_rate + '%',
                            commission_amount,
                            payment_amount + ' ' + array[i].banknote,
                            status
                        ]);
                    }
                }

                table.clear().rows.add(dataSet).draw();

            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        }
    });


});
