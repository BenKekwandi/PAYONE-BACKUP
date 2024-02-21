$(document).ready(function () {
    var table = $('#details').DataTable({
        responsive: true,
        scrollX: 200,
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[1, 'asc']],

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
        ajax: {
            url: 'company-all',
            dataType: "json",
            error: function (request) {
                alert("Error " + request);
            },
            success: function (array) {
                console.log(array)
                var dataSet = [];

                for (var i = 0; i < array.length; i++) {
                    var status = '';
                    if (array[i].status == 0) {
                        status = '<span class="btn "><i class="la la-check-circle-o text-success text-center fs-3"></i></span>';
                    }
                    else {
                        status = '<span class="btn "><i class="fa-solid fa-lock"></i></span>';
                    }
                    dataSet.push([
                        array[i].company_name,
                        array[i].owner_name,
                        array[i].email,
                        array[i].commission_rate + '%',
                        array[i].address,
                        array[i].phone,
                        status
                        //array[i].status,
                    ]);
                    ///console.log(dataSet);
                }
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        }
    });
});