$(document).ready(function () {

    var csrfToken = $('meta[name=csrf-token]').attr('content');

    $('#log_history').DataTable({
        responsive: true,
        scrollX: 200,
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[1, 'desc']]
    });

    $(document).on('click', '.block-btn', function (event) {
        event.preventDefault();

        var ip = $(this).data('ip');
        $('#blockBtn').click(function (event) {
            event.preventDefault();
            $.ajax({
                url: 'ip/' + ip,
                type: 'post',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log(response);
                    alert(response);
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });

    });

    $(document).on('click', '.unblock-btn', function (event) {
        event.preventDefault();

        var ip = $(this).data('ip');
        $('#unblockBtn').click(function (event) {
            event.preventDefault();
            $.ajax({
                url: 'ip/' + ip,
                type: 'delete',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log(response);
                    alert(response);
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });

    });

});