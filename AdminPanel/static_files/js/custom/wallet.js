$(document).ready(function () {

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
            url: 'transaction',
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
                        '<span class="btn btn-outline-success btn-sm"><i class="fas fa-check text-center"></i></span>'
                        + '<span style="display:none;">' + plainStatus + '</span>'
                    ]);


                    /*
                    if ($('#userGroup').val() == 'manager') {
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
                    else {
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
                    }*/
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
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        }
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
