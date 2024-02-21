$(document).ready(function () {
        $.ajax({
                url: '/all-companies',
                contentType: 'application/json',
                success: function (response) {
                        var json = JSON.parse(response);
                        // console.log(response);
                        var str = "";
                        for (var i = 0; i < json.length; i++) {
                                str += "<option value=" + json[i].company_id + ">" + json[i].company_name + "</option>"
                                console.log(json[i].company_id);
                        }
                        $("#companies").append(str);

                },
                error: function (error) {
                        console.log(error);
                }
        });

        var table = $('#sales_person').DataTable({
                responsive: true,
                //scrollX: 200,
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
                        //         extend: 'pdf',
                        //         className: 'btn'
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
                        url: '/all-salespersons',
                        type: "GET",
                        error: function (request) {
                                console.log(request);

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
                                                array[i].company,
                                                array[i].surname + ' ' + array[i].name,
                                                array[i].email,
                                                array[i].cell,
                                                array[i].phone,
                                                array[i].address,
                                                array[i].hired_date,
                                                array[i].finished_date,
                                                status
                                        ]);
                                        // console.log(dataSet);
                                }
                                table.clear().rows.add(dataSet).draw();
                        }
                }
        });


        $("#searchByCompany").on('click', function (event) {
                event.preventDefault();
                var id = $("#companies option:selected").val();
                $.ajax({
                        url: '/salespersons-by-company/' + id,
                        type: "GET",
                        error: function (request) {
                                console.log(request);

                        },
                        success: function (response) {
                                var array = JSON.parse(response);
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
                                                array[i].company,
                                                array[i].surname + ' ' + array[i].name,
                                                array[i].email,
                                                array[i].cell,
                                                array[i].phone,
                                                array[i].address,
                                                array[i].hired_date,
                                                array[i].finished_date,
                                                status
                                        ]);
                                        console.log(dataSet);
                                }
                                table.clear().rows.add(dataSet).draw();
                        }
                });
        });

});

