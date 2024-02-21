$(document).ready(function () {
    var csrfToken = $('meta[name=csrf-token]').attr('content');


    function validateForm(event) {
        var form = document.querySelector('.needs-validation');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            checkform();
        }
    }

    function checkform() {
        clearErrorMessages();
        const nameInput = document.getElementById('name');
        const surnameInput = document.getElementById('surname');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const addressInput = document.getElementById('address');

        // Validate Name
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Please provide a valid Name.');
        } else if (isValidName(nameInput.value)) {
            showError(nameInput, 'Please provide a valid Name format.');
        } else if (nameInput.value.length < 2) {
            showError(nameInput, 'Name must be at least 2 characters long.');
        } else if (nameInput.value.length > 35) {
            showError(nameInput, 'Name exceeds the maximum length of 35 characters.');
        }

        // Validate Surname
        if (surnameInput.value.trim() === '') {
            showError(surnameInput, 'Please provide a valid Surname.');
        } else if (surnameInput.value.length < 2) {
            showError(surnameInput, 'Surname must be at least 2 characters long.');
        } else if (surnameInput.value.length > 35) {
            showError(surnameInput, 'Surname exceeds the maximum length of 35 characters.');
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
            showError(phoneInput, 'Please provide a valid Cell Number.');
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
        // Filtering Operations

        var data = {
            'name': $('#name').val(),
            'surname': $('#surname').val(),
            'email': $('#email').val(),
            'phone': $('#phone').val(),
            'address': $('#address').val(),
        };

        $.ajax({
            url: 'bank-operator',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                console.log(response)
                alert("Successfull Deletion");
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }

        });

    });

    $(document).on('click', '.delete-btn', function (event) {
        event.preventDefault();
        var id = $(this).data('operator');

        var deleteButton = $('#deleteSubmit');

        deleteButton.click(function () {

            $.ajax({
                url: 'bank-operator/' + id,
                type: 'delete',
                dataType: 'json',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log(response);
                    alert("Successfull Deletion");
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

        var operatorId = $(this).data('operator');
        $.ajax({
            url: 'bank-operator/' + operatorId,
            type: 'GET',
            dataType: 'json',
            success: function (operatorData) {

                $('#editModal #name').val(operatorData.name);
                $('#editModal #surname').val(operatorData.surname);
                $('#editModal #email').val(operatorData.email);
                $('#editModal #address').val(operatorData.address);
                $('#editModal #phone').val(operatorData.phone);
                $('#editModal').data('operator-id', operatorId);
            },
            error: function (error) {
                alert('Error ' + error);
            }
        });

    });

    $('#editModal').on('shown.bs.modal', function () {

        var editButton = $('#editModal #editSubmitButton');

        editButton.click(function () {

            var ID = $('#editModal').data('operator-id');

            var data = {
                'name': $('#editModal #name').val(),
                'surname': $('#editModal #surname').val(),
                'email': $('#editModal #email').val(),
                'address': $('#editModal #address').val(),
                'phone': $('#editModal #phone').val(),
            };

            $.ajax({
                url: 'bank-operator/' + ID,
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log('Response:', response);
                    alert('Successful form submission');
                },
                error: function (error) {
                    //alert(error);
                    console.log(error);
                }
            });

            location.reload();
        });

    });

    var table = $('#bank_operator').DataTable({
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
            url: 'bank-operator',
            dataType: "json",
            error: function (request) {
                alert("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    dataSet.push([
                        array[i].name,
                        array[i].surname,
                        array[i].email,
                        array[i].phone,
                        array[i].address,
                        '<a data-bs-toggle="modal" data-bs-target="#editModal" data-operator="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md edit-btn" title="Edit details">\
                        <i class="la la-edit"></i></a>'+ '<a data-bs-toggle="modal" data-bs-target="#deleteModal" data-operator="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md delete-btn" title="Delete">\
                        <i class="la la-trash"></i></a>',
                    ]);

                }
                table.clear().rows.add(dataSet).draw();
            }
        }
    });

});

