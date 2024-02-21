$(document).ready(function () {
    $.ajax({
        url: '/companies',
        type: 'get',
        dataType: "JSON",
        success: function (array) {
            var str = "";
            for (var i = 0; i < array.length; i++) {
                str += "<option value='" + array.company_id + "'>" + array[i].company_name + "</option>";
            }
            $("#companies").append(str);
        },
        error: function (error) {

        }
    });
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
            // {
            //     extend: 'pdf',
            //     className: 'btn'
            // },
            {
                extend: 'print',
                className: 'btn'
            }
        ],
        ajax: {
            url: '/all-companies',
            dataType: "json",
            error: function (request) {
                alert("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                
                for (var i = 0; i < array.length; i++) {
                    var status='';
                    if(array[i].status==0)
                    {
                        status='<span class="btn btn-success"><i class="fa-solid fa-check"></i></span>';
                    }
                    else{
                        status='<span class="btn btn-danger"><i class="fa-solid fa-lock"></i></span>';
                    }
                    dataSet.push([
                        array[i].company_name,
                        array[i].owner_name,
                        array[i].email,
                        array[i].commission_rate,
                        array[i].address,
                        array[i].fax_no,
                        array[i].phone,
                        array[i].tax_no,
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