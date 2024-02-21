$(document).ready(function () {


    var table = $('#daily_transactions').DataTable({
        responsive: true,
        scrollX: 200,
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[1, 'asc']],
        ajax: {
            url: 'transaction-daily',
            dataType: "json",
            error: function (request) {
                //alert("Error " + request);
                console.log(request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    var plainStatus = 'success';
                    payment_amount = parseFloat(array[i].expected_amount) + (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100));
                    total_crypto = parseFloat(array[i].expected_crypto) + (parseFloat(array[i].expected_crypto) * (parseFloat(array[i].commission_rate) / 100));
                    commission_amount = (parseFloat(array[i].expected_amount) * (parseFloat(array[i].commission_rate) / 100))
                    var formattedExpected_crypto = new Intl.NumberFormat('de-DE').format(array[i].expected_crypto)
                    var formattedExpected_amount = new Intl.NumberFormat('de-DE').format(array[i].expected_amount)
                    var formattedReceived_crypto = new Intl.NumberFormat('de-DE').format(array[i].received_crypto)
                    var formattedPayment_amount = new Intl.NumberFormat('de-DE').format(payment_amount)
                    var formattedCommission_amount = new Intl.NumberFormat('de-DE').format(commission_amount)
                    // var formattedTotal_cypto = new Intl.NumberFormat('de-DE').format(total_crypto)


                    if ($('#userGroup').val() == 'manager') {
                        dataSet.push([
                            //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                            array[i].company,
                            array[i].salesperson,
                            array[i].api_trans_id,
                            array[i].transaction_date,
                            formattedExpected_amount + ' ' + array[i].banknote,
                            '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>'
                        ]);
                    }
                    else {
                        dataSet.push([
                            //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                            array[i].company,
                            array[i].salesperson,
                            array[i].api_trans_id,
                            array[i].transaction_date,
                            array[i].network,
                            formattedExpected_crypto + " " + array[i].coin,
                            formattedReceived_crypto + " " + array[i].coin,
                            formattedExpected_amount + " " + array[i].banknote,
                            array[i].commission_rate + '%',
                            formattedCommission_amount + " " + array[i].banknote,
                            formattedPayment_amount + " " + array[i].banknote,
                            '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                            + '<span style="display:none;">' + plainStatus + '</span>'
                        ]);
                    }

                    // console.log(dataSet);
                }
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        }
    });
});