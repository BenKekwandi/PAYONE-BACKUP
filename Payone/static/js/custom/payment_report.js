
$(document).ready(function () {
  const accessToken = $('#token').val();
  // console.log(accessToken)
  var dataTime;
  var table = $('#payments').DataTable({
    responsive: true,
    scrollX: 200,
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
      url: 'deposit-history',
      dataType: "json",
      type: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      error: function (request) {
        console.log(request);
      },
      success: function (array) {
        var dataSet = [];
        for (var i = 0; i < array.length; i++) {

          dataTime = new Date(array[i].insertTime);
          var plainStatus = 'success';
          var options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
          var formattedDateTime = dataTime.toLocaleString('en-GB', options);
          dataSet.push([
            //i + 1,
            array[i].id,
            array[i].amount,
            array[i].coin,
            array[i].network,
            formattedDateTime,
            '<span class="btn btn-success btn-sm"><i class="fas fa-check text-center"></i></span>'
            + '<span style="display:none;">' + plainStatus + '</span>'

          ]);
        }
        table.clear().rows.add(dataSet).draw();
      },
      columnDefs: [
        { targets: '_all', className: 'text-left' }
      ]
    }
  });
});
