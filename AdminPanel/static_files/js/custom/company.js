$(document).ready(function () {
    var csrfToken = $('meta[name=csrf-token]').attr('content');

    function validateForm(event) {
        var form = document.querySelector('.needs-validation');
        if (form.checkValidity() === false) {
            event.stopPropagation();
            event.preventDefault();
            checkform()
        }
    }

    function checkform() {
        clearErrorMessages();

        const companyNameInput = document.getElementById('company_name');
        const ownerNameInput = document.getElementById('owner_name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const addressInput = document.getElementById('address');
        const commissionInput = document.getElementById('commission_rate');


        // Validate Name
        if (companyNameInput.value.trim() === '') {
            showError(companyNameInput, 'Please provide a valid company name.');
        } else if (isValidName(companyNameInput.value)) {
            showError(companyNameInput, 'Please provide a valid name format.');
        } else if (companyNameInput.value.length < 2) {
            showError(companyNameInput, 'Name must be at least 2 characters long.');
        } else if (companyNameInput.value.length > 35) {
            showError(companyNameInput, 'Name exceeds the maximum length of 35 characters.');
        }

        // Validate Owner
        if (ownerNameInput.value.trim() === '') {
            showError(ownerNameInput, 'Please provide a valid name.');
        } else if (ownerNameInput.value.length < 2) {
            showError(ownerNameInput, 'Name must be at least 2 characters long.');
        } else if (ownerNameInput.value.length > 35) {
            showError(ownerNameInput, 'Name exceeds the maximum length of 35 characters.');
        }

        // Validate Email
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Please provide a valid Email.');
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Invalid email format.');
        } else if (emailInput.value.length < 5) {
            showError(emailInput, 'Email must be at least 5 characters long.');
        } else if (emailInput.value.length > 255) {
            showError(emailInput, 'Email exceeds the maximum length of 255 characters.');
        }

        // Validate Phone Number
        if (phoneInput.value.trim() === '') {
            showError(phoneInput, 'Please provide a valid phone number.');
        } else if (isNaN(phoneInput.value)) {
            showError(phoneInput, 'Phone Number must be a numeric value.');
        } else if (phoneInput.value.length < 5) {
            showError(phoneInput, 'Phone Number must be at least 5 digits long.');
        } else if (phoneInput.value.length > 14) {
            showError(phoneInput, 'Phone Number exceeds the maximum length of 14 digits.');
        }

        // Validate Address
        if (addressInput.value.trim() === '') {
            showError(addressInput, 'Please provide a valid Address.');
        } else if (addressInput.value.length < 5) {
            showError(addressInput, 'Address must be at least 5 characters long.');
        } else if (addressInput.value.length > 255) {
            showError(addressInput, 'Address exceeds the maximum length of 255 characters.');
        }

        // Validate Commission
        if (commissionInput.value.trim() === '') {
            showError(commissionInput, 'Please provide a valid Comission.');
        }

        // If there are no errors, submit the form
        function isValidEmail(email) {
            // Regular expression to validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        }
        function isValidName(name) {
            const numericPattern = /\d/;
            return numericPattern.test(name);
        }

        // Function to show error message for an input element
        function showError(inputElement, errorMessage) {
            const errorElement = document.getElementById(inputElement.id + '-error');
            errorElement.textContent = errorMessage;
            inputElement.classList.add('is-invalid');
        }

        // Function to clear error messages and remove invalid state
        function clearErrorMessages() {
            const errorElements = document.getElementsByClassName('invalid-feedback');
            for (let i = 0; i < errorElements.length; i++) {
                errorElements[i].textContent = '';
            }

            const inputElements = document.querySelectorAll('.form-control.is-invalid');
            for (let i = 0; i < inputElements.length; i++) {
                inputElements[i].classList.remove('is-invalid');
            }
        }
    }
    // Add event listener to the form submit button
    var submitBtn = document.getElementById('submitBtn');
    var editBtn = document.getElementById('editSubmitButton');
    submitBtn.addEventListener('click', function (event) {
        validateForm(event);
    });
    editBtn.addEventListener('click', function (event) {
        validateForm(event);
    });

    var form = $('#submitBtn');
    form.submit(function (e) {
        e.preventDefault();
        var data = {
            'company_name': $('#company_name').val(),
            'owner_name': $('#owner_name').val(),
            'email': $('#email').val(),
            'phone': $('#phone').val(),
            'address': $('#address').val(),
            'commission_rate': $('#commission_rate').val(),
            'home_directory': '../writable/uploads/' + $('#company_name').val()
        };

        $.ajax({
            url: 'company',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                alert("form submited Successfully");
                location.reload();
            },
            error: function (error) {
                console.log(error);
              

            }

        });

    });

    $(document).on('click', '.delete-btn', function (event) {
        event.preventDefault();
        var id = $(this).data('company');



        var deleteButton = $('#deleteSubmit');

        deleteButton.click(function () {

            $.ajax({
                url: 'company/' + id,
                type: 'delete',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log('Response:', response);
                    location.reload();
                },
                error: function (error) {
                    console.log(error);

                }
            });

        });
    });

    $(document).on('click', '.edit-btn', function (event) {

        event.preventDefault();

        var companyID = $(this).data('company');

        console.log(companyID);
        $.ajax({
            url: 'company/' + companyID,
            type: 'GET',
            dataType: 'json',
            success: function (companyData) {

                $('#editModal #company_name').val(companyData.company_name);
                $('#editModal #owner_name').val(companyData.owner_name);
                $('#editModal #email').val(companyData.email);
                $('#editModal #address').val(companyData.address);
                $('#editModal #phone').val(companyData.phone);
                $('#editModal #commission_rate').val(companyData.commission_rate);
                $('#editModal').data('company', companyID);
            },
            error: function (error) {
                //alert('Error ' + error);
                console.log(error);
            }
        });

    });

    $('#editModal').on('shown.bs.modal', function () {

        var editButton = $('#editModal #editSubmitButton');

        editButton.click(function () {

            var ID = $('#editModal').data('company');

            var data = {
                'company_name': $('#editModal #company_name').val(),
                'owner_name': $('#editModal #owner_name').val(),
                'email': $('#editModal #email').val(),
                'phone': $('#editModal #phone').val(),
                'address': $('#editModal #address').val(),
                'commission_rate': $('#editModal #commission_rate').val()
            };
            console.log(ID);

            $.ajax({
                url: 'company/' + ID,
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    //alert(response);
                    console.log(response);
                    alert('Successful form submission');
                },
                error: function (error) {
                    alert(error);
                    console.log(error);
                }
            });

            location.reload();
        });

    });


    var table = $('#companies').DataTable({
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
            url: 'company',
            dataType: "json",
            error: function (request) {
                alert("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    dataSet.push([

                        '<a href="/company-details/' + array[i].id + '">' + array[i].company_name + '</a>',
                        array[i].owner_name,
                        array[i].commission_rate + '%',
                        array[i].phone,
                        array[i].address,
                        array[i].email,
                        '<a data-bs-toggle="modal" data-bs-target="#editModal" data-company="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md edit-btn" title="Edit details">\
                        <i class="la la-edit"></i></a>'+ '<a data-bs-toggle="modal" data-bs-target="#deleteModal" data-company="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md delete-btn" title="Delete">\
                        <i class="la la-trash"></i></a>'
                    ]);
                }
                table.clear().rows.add(dataSet).draw();
            },
            columnDefs: [
                { targets: '_all', className: 'text-left' }
            ]
        }
    });

    $('#companies tbody').on('click', '.btn-plus', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });

});

function format(data) {
    // `data` is the original data object for the row
    return (
        '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td>Extra info:</td>' +
        '<td>And any further details here (images etc)...</td>' +
        '</tr>' +
        '</table>'
    );
}
