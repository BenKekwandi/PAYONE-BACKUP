$(document).ready(function () {


    /*

    $("#submitBtn").on("click", function (e) {
        var network = $('#network').val();
        var timeFormat = $('#timeFormat').val();
        var companyId = $('#company').val();
        if (network === '' || timeFormat === '' || companyId === '') {
            alert("No empty field allowed")
            return;
        }
        $.ajax({
            url: 'transaction-query/' + network + '/' + companyId + '/' + timeFormat,
            type: "get",
            error: function (error) {
                console.log(error);
            },
            success: function (array) {
                console.log(array)
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    var status = '';
                    if (array[i].status == 0) {
                        status = '<span class="btn btn-success"><i class="fa-solid fa-check"></i></span>';
                    }
                    else {
                        status = '<span class="btn btn-danger"><i class="fa-solid fa-lock"></i></span>';
                    }
                    dataSet.push([
                        //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                        array[i].company,
                        array[i].salesperson,
                        array[i].api_trans_id,
                        array[i].transaction_date,
                        array[i].network,
                        array[i].expected_crypto + array[i].coin,
                        array[i].received_crypto + array[i].coin,
                        array[i].expected_amount + array[i].banknote,
                        array[i].commission_rate + '%',
                        commission_amount + array[i].banknote,
                        payment_amount + array[i].banknote,
                        status,
                        '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                        + '<span style="display:none;">' + status + '</span>'
                    ]);
                    console.log(dataSet)
                }
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        });

    });

    */

    var request_url = 'transaction';
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
    }

    if ($('#userGroup').val() == 'Manager') {
        var companyId = $('#companyId').val();
        request_url = 'transaction-company/' + companyId;
    }

    alert("The requested url: " + request_url);

    var table = $('#transactions').DataTable({
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
            url: request_url,
            dataType: "json",
            error: function (request) {
                console.log(request);
            },
            success: function (array) {

                console.log(array);
                var dataSet = [];

                var receivedCryptoTotal = 0;
                var paymentAmountTotal = 0;
                var commissionAmountTotal = 0;
                var totalAmountWithoutCommissionTotal = 0;

                for (var i = 0; i < array.length; i++) {

                    var plainStatus = 'success';
                    payment_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                    total_crypto = parseFloat(array[i].expected_crypto) + (parseFloat(array[i].expected_crypto) * (parseFloat(array[i].commission_rate) / 100));
                    commission_amount = (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))

                    receivedCryptoTotal += parseFloat(array[i].received_crypto);
                    paymentAmountTotal += parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                    commissionAmountTotal += (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))
                    totalAmountWithoutCommissionTotal += parseFloat(array[i].expected_amount);
                    /*
                    dataSet.push([
                        // '<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                        array[i].company,
                        array[i].salesperson,
                        array[i].api_trans_id,
                        array[i].transaction_date,
                        array[i].network,
                        array[i].expected_crypto + array[i].coin,
                        array[i].received_crypto + array[i].coin,
                        array[i].expected_amount + array[i].banknote,
                        array[i].commission_rate + '%',
                        commission_amount + array[i].banknote,
                        payment_amount + array[i].banknote,
                        '<span class=" btn-sm"><i class="la la-check-circle-o text-success text-center fs-3"></i></span>'
                        + '<span style="display:none;">' + plainStatus + '</span>'
                    ]);

                    */

                    if ($('#userGroup').val() == 'Manager') {
                        dataSet.push([
                            //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                            array[i].company,
                            array[i].salesperson,
                            array[i].api_trans_id,
                            array[i].transaction_date,
                            array[i].expected_amount + array[i].banknote,
                            '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>'
                        ]);
                    }
                    else if ($('#userGroup').val() == 'Admin') {
                        dataSet.push([
                            //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                            array[i].company,
                            array[i].salesperson,
                            array[i].api_trans_id,
                            array[i].transaction_date,
                            array[i].network,
                            array[i].expected_crypto + array[i].coin,
                            array[i].received_crypto + array[i].coin,
                            array[i].expected_amount + array[i].banknote,
                            array[i].commission_rate + '%',
                            commission_amount + array[i].banknote,
                            payment_amount + array[i].banknote,
                            '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>'
                        ]);
                    }
                    /*
                    dataSet.push([
                        //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                        array[i].company,
                        array[i].salesperson,
                        array[i].api_trans_id,
                        array[i].transaction_date,
                        array[i].network,
                        array[i].expected_crypto + array[i].coin,
                        array[i].received_crypto+ array[i].coin,
                        array[i].expected_amount + array[i].banknote,
                        array[i].commission_rate + '%',
                        commission_amount+ array[i].banknote,
                        payment_amount+ array[i].banknote,
                        '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                        +'<span style="display:none;">'+plainStatus+'</span>'
                    ]);
                    console.log(dataSet);
                    */
                }

                console.log(dataSet);

                table.clear().rows.add(dataSet).draw();

            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ],

        },

        /*

        footerCallback: function (row, data, start, end, display) {
            console.log('Hey footer');
            var api = this.api();
            receivedCryptoTotal = api.column(6).data().reduce(function (a, b) {
                return parseFloat(a) + parseFloat(b);
            }, 0);
            paymentAmountTotal = api.column(10).data().reduce(function (a, b) {
                return parseFloat(a) + parseFloat(b);
            }, 0);
            commissionAmountTotal = api.column(9).data().reduce(function (a, b) {
                return parseFloat(a) + parseFloat(b);
            }, 0);
            totalAmountWithoutCommissionTotal = api.column(7).data().reduce(function (a, b) {
                return parseFloat(a) + parseFloat(b);
            }, 0);


            $(api.column(6).footer()).html('Total received crypto: ' + receivedCryptoTotal + 'BTC');
            $(api.column(7).footer()).html('Total Amount without Commision: ' + totalAmountWithoutCommissionTotal + 'TRY');
            $(api.column(9).footer()).html('Total Commission Amount: ' + commissionAmountTotal + 'TRY');
            $(api.column(10).footer()).html('Total Payment Amount: ' + paymentAmountTotal + 'TRY');

        }

        */
    });


    // $('#transactions tfoot th').each(function (i) {
    //     var title = $('#transactions thead th').eq($(this).index()).text();
    //     $(this).html('<input type="text" placeholder="' + title + '" data-index="' + i + '" />');
    // });

    // $(table.table().container()).on('keyup', 'tfoot input', function () {
    //     table
    //         .column($(this).data('index'))
    //         .search(this.value)
    //         .draw();
    // });


});
