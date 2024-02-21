$(document).ready(function () {
    var csrfToken = $('meta[name=csrf-token]').attr('content');

    var table = $('#DepositHistory').DataTable({
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
            url: 'deposit-history',
            type: 'get',
            error: function (response) {
                console.log(response);
            },
            success: function (array) {
                var dataSet = [];
                console.log(array)
                for (var i = 0; i < array.length; i++) {
                    dataSet.push([
                        //i + 1,
                        array[i].id,
                        array[i].amount,
                        array[i].coin,
                        array[i].network,
                        innerHtml = formattedDateTime,
                        innerHtml = status,
                    ]);
                    console.log(dataSet);
                }
                table.clear().rows.add(dataSet).draw();
            }

        }
    });



    var submitButton = $('#submitBtn');

    submitButton.click(function (e) {
        e.preventDefault();

        var data = {
            'coin': $("#coin").val(),
        };
        console.log(data);
        $.ajax({
            url: 'deposit-history',
            type: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken
            },
            error: function (response) {
                console.log(response);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {

                    var dataTime = new Date(array[i].insertTime);
                    var options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                    var formattedDateTime = dataTime.toLocaleString('en-GB', options);
                    var status = array[i].status;
                    if (status === 1) { status = '<span class="badge text-bg-success">Completed</span>' };
                    dataSet.push([
                        ///i + 1,
                        array[i].id,
                        array[i].amount,
                        array[i].coin,
                        array[i].network,
                        formattedDateTime,
                        status,
                    ]);
                    console.log(dataSet);
                }
                table.clear().rows.add(dataSet).draw();
            }

        });

    });

});
