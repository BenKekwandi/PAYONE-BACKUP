$(document).ready(function () {


    var csrfToken = $('meta[name=csrf-token]').attr('content');

    $('#users').DataTable({
        responsive: true,
        dom: '<"top"fB>rt<"bottom"lip>',
        lengthMenu: [10, 25, 50, 100, 200],
        scrollX: 200,
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[1, 'asc']],
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
    });


    $(document).on('click', '.deactivate-btn', function (event) {
        event.preventDefault();

        var userId = $(this).data('user');
        $('#deactiveBtn').click(function (event) {
            event.preventDefault();
            $.ajax({
                url: 'user/' + userId,
                type: 'delete',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    // console.log(response);
                    alert("User successfully banned");
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });

    });

    $(document).on('click', '.activate-btn', function (event) {
        event.preventDefault();

        var userId = $(this).data('user');
        $('#activeBtn').click(function (event) {
            event.preventDefault();
            $.ajax({
                url: 'user/' + userId,
                type: 'post',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    // console.log(response);
                    alert("User successfully activated");
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });

    });


    $(document).on('click', '.link-btn', function (event) {
        event.preventDefault();

        var userId = $(this).data('user');
        $('#linkBtn').click(function (event) {
            event.preventDefault();
            $.ajax({
                url: 'user-link/' + userId,
                type: 'post',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    //console.log(response);
                    alert("Password Link succesfully sent");
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });

    });


});