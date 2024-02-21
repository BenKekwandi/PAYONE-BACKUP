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

                    if ($('#userGroup').val() == 'manager') {
                        dataSet.push([
                            //'<button type="button" id="table-btn" class="btn btn-link btn-plus"><i class="fa-solid fa-chevron-down text-center bg-custom-info-2"></i></button>',
                            array[i].transaction_date,
                            array[i].company,
                            array[i].salesperson,
                            array[i].id,
                            array[i].expected_amount + array[i].banknote,
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

                    console.log(dataSet);
                }
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        }
    });
});