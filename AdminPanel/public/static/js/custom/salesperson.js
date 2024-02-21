$(document).ready(function () {
    const csrfToken = $('meta[name=csrf-token]').attr('content');
    const submitBtn = $('#submitBtn');
    const form = $('.needs-validation');


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
            company_id: $('#company_id').val()
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
            company_id: {
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
                alert(response)
                location.reload();
            },
            error: function (error) {
                console.log(error);
            },
        });
    }

    $(document).on('click', '.delete-btn', function (event) {
        event.preventDefault();
        var id = $(this).data('salesperson');
        $('#deleteModal #deleteSubmit').click(function () {
            deletesalesperson(id)
        })
    });

    function deletesalesperson(id) {
        $.ajax({
            url: 'salesperson/' + id,
            type: 'delete',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                // console.log('Response:', response);
                location.reload()
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function loadSalespersonData(salespersonID) {

        $.ajax({
            url: 'salesperson/' + salespersonID,
            type: 'GET',
            dataType: 'json',
            success: function (salespersonData) {

                $('#editModal #name').val(salespersonData.name);
                $('#editModal #surname').val(salespersonData.surname);
                $('#editModal #email').val(salespersonData.email);
                $('#editModal #address').val(salespersonData.address);
                $('#editModal #phone').val(salespersonData.phone);
                $('#editModal #customer_id').val(salespersonData.company_id);
                $('#editModal').data('salesperson-id', salespersonID);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    $(document).on('click', '.edit-btn', function (event) {
        event.preventDefault();
        var salespersonID = $(this).data('salesperson');
        loadSalespersonData(salespersonID);
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
    $('#editModal #updateBtn').click(function (e) {
        e.preventDefault()
        if (validateEditForm()) {
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
                    // console.log(response)
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

    var table = $('#salesperson').DataTable({
        responsive: true,
        scrollX: 200,
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[0, 'desc']],
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
            url: 'salesperson',
            dataType: "json",
            error: function (request) {
                // alert("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    var actions = '<a data-bs-toggle="modal" data-bs-target="#editModal" data-salesperson="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md edit-btn" title="Düzenle">\
                    <i class="la la-edit"></i></a>';
                    dataSet.push([
                        array[i].id,
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
