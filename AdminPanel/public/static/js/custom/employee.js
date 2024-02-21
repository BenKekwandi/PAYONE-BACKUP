$(document).ready(function () {
    const csrfToken = $('meta[name=csrf-token]').attr('content');
    const submitBtn = $('#submitBtn');
    const form = $('.needs-validation');

    submitBtn.click(function (e) {
        e.preventDefault();
        if (validateForm()) {
            submitData();
        }
    });

    function validateForm() {
        clearErrorMessages();

        const formData = {
            name: $('#name').val(),
            surname: $('#surname').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
            position: $('#position').val()
        };

        const validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 35,
                format: /^[a-zA-Z\s']+$/,
            },
            surname: {
                required: true,
                minLength: 2,
                maxLength: 35,
                format: /^[a-zA-Z\s']+$/,
            },
            email: {
                required: true,
                minLength: 5,
                maxLength: 255,
                format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
            phone: {
                required: true,
                minLength: 5,
                maxLength: 14,
                format: /^\d+$/,
            },
            address: {
                required: true,
                minLength: 5,
                maxLength: 255,
            },
            position: {
                required: true,
            },
        };

        let isValid = true;

        for (const field in formData) {
            const inputElement = $('#' + field);
            const errorMessageElement = $('#' + field + '-error');
            const value = formData[field];
            const rules = validationRules[field];

            if (rules.required && value === '') {
                showError(inputElement, errorMessageElement, 'Please provide a valid ' + field.replace('_', ' ') + '.');
                isValid = false;
            } else if (rules.minLength && value.length < rules.minLength) {
                showError(inputElement, errorMessageElement, field.replace('_', ' ') + ' must be at least ' + rules.minLength + ' characters long.');
                isValid = false;
            } else if (rules.maxLength && value.length > rules.maxLength) {
                showError(inputElement, errorMessageElement, field.replace('_', ' ') + ' exceeds the maximum length of ' + rules.maxLength + ' characters.');
                isValid = false;
            } else if (rules.format && !rules.format.test(value)) {
                showError(inputElement, errorMessageElement, 'Invalid ' + field.replace('_', ' ') + ' format.');
                isValid = false;
            }
            else if (rules.format && !rules.format.test(value)) {
                showError(inputElement, errorMessageElement, 'Invalid ' + field.replace('_', ' ') + ' format.');
                isValid = false;
            } else if (rules.min && parseFloat(value) < rules.min) {
                showError(inputElement, errorMessageElement, field.replace('_', ' ') + ' must be greater than or equal to ' + rules.min + '.');
                isValid = false;
            } else if (rules.max && parseFloat(value) > rules.max) {
                showError(inputElement, errorMessageElement, field.replace('_', ' ') + ' must be less than or equal to ' + rules.max + '.');
                isValid = false;
            }
        }

        return isValid;
    }

    function showError(inputElement, errorMessageElement, errorMessage) {
        errorMessageElement.text(errorMessage);
        inputElement.addClass('is-invalid');
    }

    function clearErrorMessages() {
        const errorElements = $('.invalid-feedback');
        errorElements.text('');
        form.find('.form-control.is-invalid').removeClass('is-invalid');
    }

    function submitData() {
        const data = {
            'name': $('#name').val(),
            'surname': $('#surname').val(),
            'email': $('#email').val(),
            'phone': $('#phone').val(),
            'address': $('#address').val(),
            'position': $('#position').val(),
        };

        $.ajax({
            url: 'employee',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {

                location.reload();
            },
            error: function (error) {
                console.log(error);
            },
        });
    }

    $(document).on('click', '.delete-btn', function (event) {
        var id = $(this).data('employee');
        $('#deleteModal #deleteSubmit').click(function () {
            deleteEmployee(id)
        })
    });


    function deleteEmployee(id) {
        $.ajax({
            url: 'employee/' + id,
            type: 'delete',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                // console.log(response)
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function loadEmployeeData(employeeID) {
        $.ajax({
            url: 'employee/' + employeeID,
            type: 'GET',
            dataType: 'json',
            success: function (employeeData) {

                $('#editModal #name').val(employeeData.name);
                $('#editModal #surname').val(employeeData.surname);
                $('#editModal #email').val(employeeData.email);
                $('#editModal #address').val(employeeData.address);
                $('#editModal #phone').val(employeeData.phone);
                $('#editModal #position').val(employeeData.position);
                $('#editModal').data('employee-id', employeeID);
            },
            error: function (error) {
                alert('Error ' + error);
            }
        });
    }

    $(document).on('click', '.edit-btn', function (event) {
        event.preventDefault();
        var employeeID = $(this).data('employee');
        loadEmployeeData(employeeID);
    });

    const editValidationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 35,
            format: /^[a-zA-Z\s']+$/,
        },
        surname: {
            required: true,
            minLength: 2,
            maxLength: 35,
            format: /^[a-zA-Z\s']+$/,
        },
        email: {
            required: true,
            minLength: 5,
            maxLength: 255,
            format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        phone: {
            required: true,
            minLength: 5,
            maxLength: 14,
            format: /^\d+$/,
        },
        address: {
            required: true,
            minLength: 5,
            maxLength: 255,
        },
        position: {
            required: true,
        },
    };

    // Function to validate the edit form
    function validateEditForm() {
        clearErrorMessages();

        let isValid = true;

        for (const field in editValidationRules) {
            const inputElement = $('#editModal #' + field);
            const errorMessageElement = $('#editModal #' + field + '-error');
            const value = inputElement.val().trim();
            const rules = editValidationRules[field];

            if (rules.required && value === '') {
                showError(inputElement, errorMessageElement, 'Please provide a valid ' + field.replace('_', ' ') + '.');
                isValid = false;
            } else if (rules.minLength && value.length < rules.minLength) {
                showError(inputElement, errorMessageElement, field.replace('_', ' ') + ' must be at least ' + rules.minLength + ' characters long.');
                isValid = false;
            } else if (rules.maxLength && value.length > rules.maxLength) {
                showError(inputElement, errorMessageElement, field.replace('_', ' ') + ' exceeds the maximum length of ' + rules.maxLength + ' characters.');
                isValid = false;
            } else if (rules.format && !rules.format.test(value)) {
                showError(inputElement, errorMessageElement, 'Invalid ' + field.replace('_', ' ') + ' format.');
                isValid = false;
            }
        }

        return isValid;
    }



    $('#editModal #editSubmitButton').click(function () {
        if (validateEditForm()) {
            var ID = $('#editModal').data('employee-id');

            var data = {
                'name': $('#editModal #name').val(),
                'surname': $('#editModal #surname').val(),
                'email': $('#editModal #email').val(),
                'phone': $('#editModal #phone').val(),
                'address': $('#editModal #address').val(),
                'position': $('#editModal #position').val(),
            };

            $.ajax({
                url: 'employee/' + ID,
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    // console.log(response)
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });




    var table = $('#employees').DataTable({
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
            url: 'employee',
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
                        array[i].position,
                        '<a data-bs-toggle="modal" data-bs-target="#editModal" data-employee="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md edit-btn" title="Edit details">\
                        <i class="la la-edit"></i></a>'+ '<a data-bs-toggle="modal" data-bs-target="#deleteModal" data-employee="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md delete-btn" title="Delete">\
                        <i class="la la-trash"></i></a>',
                    ]);
                }
                table.clear().rows.add(dataSet).draw();
            }
        }
    });

});


