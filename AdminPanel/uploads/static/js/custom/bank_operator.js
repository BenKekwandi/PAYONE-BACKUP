$(document).ready(function () {
    const csrfToken = $('meta[name=csrf-token]').attr('content');
    const submitBtn = $('#submitBtn, #editModal #editSubmitButton');
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
            name: $('#name').val().trim(),
            surname: $('#surname').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            address: $('#address').val().trim(),
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
            name: $('#name').val(),
            surname: $('#surname').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
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
                alert(response)
                console.log(response);
                location.reload();
            },
            error: function (error) {
                console.log(error);
            },
        });
    }


    $(document).on('click', '.delete-btn', function (event) {
        event.preventDefault();
        var id = $(this).data('operator');
        $('#deleteModal #deleteSubmit').click(function () {
            deleteOperator(id)
        })
    });

    function deleteOperator(id) {
        $.ajax({
            url: 'bank-operator/' + id,
            type: 'delete',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                console.log(response)
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    // $(document).on('click', '.delete-btn', function (event) {
    //     event.preventDefault();
    //     var id = $(this).data('operator');

    //     var deleteButton = $('#deleteSubmit');

    //     deleteButton.click(function () {

    //         $.ajax({
    //             url: 'bank-operator/' + id,
    //             type: 'delete',
    //             dataType: 'json',
    //             headers: {
    //                 'X-CSRFToken': csrfToken
    //             },
    //             success: function (response) {
    //                 console.log(response);
    //                 alert("form submited Successfully");
    //                 location.reload();
    //             },
    //             error: function (error) {
    //                 console.log(error);
    //             }
    //         });

    //     });
    // });


    function loadOperatorData(operatorID) {
        $.ajax({
            url: 'bank-operator/' + operatorID,
            type: 'GET',
            dataType: 'json',
            success: function (operatorData) {
                $('#editModal #name').val(operatorData.name);
                $('#editModal #surname').val(operatorData.surname);
                $('#editModal #email').val(operatorData.email);
                $('#editModal #address').val(operatorData.address);
                $('#editModal #phone').val(operatorData.phone);
                $('#editModal').data('operator-id', operatorID);

            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    $(document).on('click', '.edit-btn', function (event) {
        event.preventDefault();
        var operatorId = $(this).data('operator');
        loadOperatorData(operatorId);
    });
    // $(document).on('click', '.edit-btn', function (event) {

    //     event.preventDefault();

    //     var operatorId = $(this).data('operator');
    //     $.ajax({
    //         url: 'bank-operator/' + operatorId,
    //         type: 'GET',
    //         dataType: 'json',
    //         success: function (operatorData) {

    //             $('#editModal #name').val(operatorData.name);
    //             $('#editModal #surname').val(operatorData.surname);
    //             $('#editModal #email').val(operatorData.email);
    //             $('#editModal #address').val(operatorData.address);
    //             $('#editModal #phone').val(operatorData.phone);
    //             $('#editModal').data('operator-id', operatorId);
    //         },
    //         error: function (error) {
    //             alert('Error ' + error);
    //         }
    //     });

    // });
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
    };

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
                    console.log(response)
                    location.reload();
                },
                error: function (error) {
                    alert(error);
                    console.log(error);
                }
            });
        }
    });

    $('#editModal').on('shown.bs.modal', function () {

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

