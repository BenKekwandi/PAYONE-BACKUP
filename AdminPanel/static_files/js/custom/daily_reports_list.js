
$(document).ready(function (event) {

    var table = $('#daily_report_list').DataTable({
        ajax: {
            url: '/daily-reports-list',
            dataType: "json",
            success: function (array) {
                var data = [];
                for (var i = 0; i < array.length; i++) {
                    var text = '<a href="/uploads/reports/' + array[i].file_name + '" target="_blank" download>Download</a>';
                    data.push([
                        //array[i].report_id,
                        array[i].file_name,
                        array[i].created_date,
                        array[i].created_time,
                        array[i].sent_date,
                        array[i].sent_time,
                        innerHtml = text
                    ]);
                    console.log(data);
                }
                table.clear().rows.add(data).draw();
            },
            error: function (error) {
                console.log('error');
            }
        }
    });
    // table.on('click', 'button', function (e) {
    //     let data = table.row(e.target.closest('tr')).data();
    //    //alert(data[0] + "'s salary is: " + data[6]);
    //    $.ajax({
    //             url: '/download-file',
    //             dataType:"json",
    //             type:'get',
    //             error: function (request) {
    //             alert("Error " + request);
    //             },
    //             success: function (array) {
    //             }
    //     });
    // });

});


