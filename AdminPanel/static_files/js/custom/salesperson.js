$(document).ready(function () {
    var csrfToken = $('meta[name=csrf-token]').attr('content');

    $.ajax({
        url: 'company',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var selectElement = $('#company_id');
            response.forEach(function (company) {
                var optionText = company.company_name;
                var option = $('<option>').val(company.id).text(optionText);
                selectElement.append(option);
            });
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });

    function validateForm(event) {
        var form = document.querySelector('.needs-validation');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            checkform()
        }
    }
    function checkform() {
        clearErrorMessages();
        const nameInput = document.getElementById('name');
        const surnameInput = document.getElementById('surname');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const addressInput = document.getElementById('address');
        const companyIDInput = document.getElementById('company_id');

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
            showError(phoneInput, 'Please provide a valid Phone Number.');
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


        // Validate Privileges Code
        if (companyIDInput.value.trim() === '') {
            showError(companyIDInput, 'Please choose a Company.');
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
    var editBtn = document.getElementById('editSubmit');
    submitBtn.addEventListener('click', function (event) {
        validateForm(event);
    });
    editBtn.addEventListener('click', function (event) {
        validateForm(event);
    });

    var form = $('#employeeCreateForm');
    form.submit(function (e) {
        e.preventDefault();

        var data = {
            'name': $('#name').val(),
            'surname': $('#surname').val(),
            'email': $('#email').val(),
            'address': $('#address').val(),
            'phone': $('#phone').val(),
            'company_id': $('#company_id').val()
        };

        $.ajax({
            url: 'salesperson',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });


    $(document).on('click', '.delete-btn', function (event) {
        event.preventDefault();
        var id = $(this).data('salesperson');

        var deleteButton = $('#deleteSubmit');

        deleteButton.click(function () {

            $.ajax({
                url: 'salesperson/' + id,
                type: 'delete',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log('Response:', response);
                    location.reload()
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });
    });

    $(document).on('click', '.edit-btn', function (event) {

        event.preventDefault();

        var ID = $(this).data('salesperson');

        console.log(ID);

        $.ajax({
            url: 'salesperson/' + ID,
            type: 'GET',
            dataType: 'json',
            success: function (salespersonData) {

                $('#editModal #name').val(salespersonData.name);
                $('#editModal #surname').val(salespersonData.surname);
                $('#editModal #email').val(salespersonData.email);
                $('#editModal #address').val(salespersonData.address);
                $('#editModal #phone').val(salespersonData.phone);
                $('#editModal #customer_id').val(salespersonData.company_id);
                $('#editModal').data('salesperson-id', ID);
            },
            error: function (error) {
                console.log(error);
            }
        });

    });

    $('#editModal').on('shown.bs.modal', function () {

        var editButton = $('#editModal #editSubmit');

        editButton.click(function () {

            var ID = $('#editModal').data('salesperson-id');

            var data = {
                'name': $('#editModal #name').val(),
                'surname': $('#editModal #surname').val(),
                'email': $('#editModal #email').val(),
                'address': $('#editModal #address').val(),
                'phone': $('#editModal #phone').val(),
            };
            $.ajax({
                url: 'salesperson/' + ID,
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log(response);
                    location.reload()
                    //alert('Item updated');
                },
                error: function (error) {
                    console.log(error);
                    //alert("Update Failed")
                }
            });
        });

    });

    var table = $('#salesperson').DataTable({
        responsive: true,
        scrollX: 200,
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
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
        order: [[1, 'asc']],
        ajax: {
            url: 'salesperson',
            dataType: "json",
            error: function (request) {
                alert("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    var actions = '<a data-bs-toggle="modal" data-bs-target="#editModal" data-salesperson="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md edit-btn" title="Edit details">\
                    <i class="la la-edit"></i></a>'+ '<a data-bs-toggle="modal" data-bs-target="#deleteModal" data-salesperson="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md delete-btn" title="Delete">\
                    <i class="la la-trash"></i></a>';
                    dataSet.push([
                        array[i].company,
                        array[i].name + ' ' + array[i].surname,
                        array[i].email,
                        array[i].phone,
                        array[i].address,
                        actions,
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
