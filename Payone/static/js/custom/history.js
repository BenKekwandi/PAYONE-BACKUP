$(document).ready(function () {
    const accessToken = $('#token').val();
    var dataTime;
    var table = $('#transactionHistory').DataTable({
        responsive: true,
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[0, 'desc']],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'copy',
                className: 'btn'
            },
            {
                extend: 'excel',
                className: 'btn'
            },
            //   {
            //     extend: 'pdf',
            //     className: 'btn'
            //   },
            {
                extend: 'print',
                className: 'btn'
            }
        ],
        ajax: {
            url: 'transactions',
            dataType: "json",
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            error: function (request) {
                console.log("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    var plainStatus = '';
                    var number = new Intl.NumberFormat('de-DE').format(array[i].expected_amount)
                    var status = array[i].transaction_status;
                    dataTime = new Date(parseInt(array[i].start_timestamp) * 1000);
                    var formattedlog = moment(array[i].insert_timestamp).format('YYYY-MM-DD HH:mm');
                    if (array[i].insert_timestamp == null) {
                        formattedlog = '-'
                    }
                    var options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                    var startDate = dataTime.toLocaleString('en-GB', options);
                    var received_crypto = 0;
                    var expected_crypto = array[i].expected_crypto;
                    var received_amount = array[i].received_crypto * array[i].exchange_rate;
                    var commission_amount = received_amount * (parseFloat(array[i].commission_rate) / 100)
                    received_amount -= commission_amount
                    var formattedreceived_amount = new Intl.NumberFormat('de-DE').format(received_amount);
                    var formattedExchangeRate = new Intl.NumberFormat('de-DE').format(array[i].exchange_rate)
                    // var formattedExchangeRate = exchange_rate.toLocaleString();

                    // console.log(received_amount)
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
                            formattedreceived_amount = new Intl.NumberFormat('de-DE').format(array[i].expected_amount);
                            received_amount = array[i].expected_amount
                        }
                        else {
                            status = '<span><i class="la la-check-circle-o text-danger text-center fs-3"></i></span>'
                            received_crypto = '<span class="text-danger">' + array[i].received_crypto + '</span>'
                            expected_crypto = '<span class="text-danger">' + array[i].expected_crypto + '</span>'
                            plainStatus = 'SUCCESS';
                        }

                    }
                    var unpaid_amount = array[i].expected_amount - received_amount
                    var formattedunpaid_amount = new Intl.NumberFormat('de-DE').format(unpaid_amount)
                    dataSet.push([
                        //i + 1,
                        '<a href="/qrcode/' + array[i].id + '">' + array[i].id + '</a>',
                        startDate,
                        formattedlog,
                        expected_crypto + ' ' + array[i].coin,
                        received_crypto + ' ' + array[i].coin,                    
                        number,
                        formattedreceived_amount,
                        formattedunpaid_amount + ' ' + array[i].banknote,
                        formattedExchangeRate + ' ' + array[i].banknote,
                        // array[i].network,
                        array[i].commission_rate + '%',
                        status + '<span style="display:none;">' + plainStatus + '</span>',

                    ]);
                }
                table.clear().rows.add(dataSet).draw();
            }
        }
    });

    $.ajax({
        url: 'deposit-history',
        dataType: "json",
        type: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${accessToken}`,
        // },
    });

});