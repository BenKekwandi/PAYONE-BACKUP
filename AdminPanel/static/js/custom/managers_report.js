$(document).ready(function () {


    $.ajax({
        url: 'company',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var selectElement = $('#companyId');
            response.forEach(function (company) {
                var optionText = company.company_name;
                var option = $('<option>').val(company.id).text(optionText);
                selectElement.append(option);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });

    var table = $('#manager').DataTable({
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
                extend: 'excel',
                className: 'btn'
            },
            {
                extend: 'print',
                className: 'btn'
            }
        ],
        ajax: {
            url: 'manager-all',
            type: "get",
            error: function (request) {
                // alert("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    var status = '';
                    if (array[i].status == 0) {
                        status = '<span ><i class="la la-check-circle-o text-success text-center fs-3"></i></span>';
                    }
                    else {
                        status = '<span class="btn btn-danger"><i class="fa-solid fa-lock"></i></span>';
                    }
                    dataSet.push([
                        array[i].company,
                        array[i].name + ' ' + array[i].surname,
                        array[i].email,
                        array[i].phone,
                        array[i].address,
                        status
                    ]);
                }
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        }
    });

    $("#submitBtn").on("click", function (e) {
        e.preventDefault();
        companyId = $("#companyId").val()
        if (companyId === "") {
            var url = 'manager';
        }
        else {
            url = 'manager-company/' + companyId
        }

        $.ajax({
            url: url,
            type: "get",
            error: function (request) {
                alert("Error " + request);
            },
            success: function (array) {
                // console.log(array)
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
                        array[i].company,
                        array[i].name + ' ' + array[i].surname,
                        array[i].email,
                        array[i].phone,
                        array[i].address,
                        status
                    ]);
                    // console.log(dataSet)
                }
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        });
    });
});
