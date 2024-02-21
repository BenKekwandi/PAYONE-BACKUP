$(document).ready(function () {

    $.ajax({
        url: '/companies',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var selectElement = $('#company');
            var companies = JSON.parse(response);
            companies.forEach(function (company) {
                var optionText = company.company_name;
                var option = $('<option>').val(company.company_name).text(optionText);
                selectElement.append(option);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });

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
        order: [[1, 'asc']],
        ajax: {
            url: '/all-salespersons-transactions-get',
            type: 'get',
            error: function (response) {
                console.log(response);
            },
            success: function (array) {
                // var dataArray = JSON.parse(array)
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
                        status = '<span class="btn btn-success btn-sm"><i class="fas fa-check"></i></span>'
                        plainStatus = "Success";
                    }
                    dataSet.push([
                        //i + 1,
                        array[i].company,
                        array[i].salesperson,
                        //array[i].transaction_id,
                        startDate,
                        receivedDate,
                        array[i].expected_crypto,
                        array[i].received_crypto,
                        array[i].coin,
                        array[i].expected_amount + ' ' + array[i].banknote,
                        array[i].network,
                        array[i].comission_rate,
                        status

                    ]);
                    // console.log(dataSet);
                }
                table.clear().rows.add(dataSet).draw();
            }
        }
    });

    var submitButton = $('#submitBtn');

    submitButton.click(function (e) {
        e.preventDefault();

        var data = {
            'company': $("#company").val()
            // 'status': $("#status").val()
        };
        console.log(data)
        $.ajax({
            url: '/all-salespersons-transactions',
            type: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json',
            error: function (response) {
                console.log(response);
            },
            success: function (array) {
                var dataArray = JSON.parse(array)
                console.log(dataArray)
                var dataSet = [];
                for (var i = 0; i < dataArray.length; i++) {

                    var status = dataArray[i].transaction_status;
                    dataTime = new Date(parseInt(dataArray[i].start_timestamp));
                    var newdataTime = new Date(parseInt(dataArray[i].insert_timestamp));
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
                        status = '<span class="btn btn-success btn-sm"><i class="fas fa-check"></i></span>'
                        plainStatus = "Success";
                    }
                    dataSet.push([
                        //i + 1,
                        dataArray[i].company,
                        dataArray[i].salesperson,
                        //dataArray[i].transaction_id,
                        startDate,
                        receivedDate,
                        dataArray[i].expected_crypto,
                        dataArray[i].received_crypto,
                        dataArray[i].coin,
                        dataArray[i].expected_amount + ' ' + dataArray[i].banknote,
                        dataArray[i].network,
                        dataArray[i].comission_rate,
                        status + '<span style="display:none;">' + plainStatus + '</span>',

                    ]);
                    // console.log(dataSet);
                }
                table.clear().rows.add(dataSet).draw();
            }
        });

    });

});