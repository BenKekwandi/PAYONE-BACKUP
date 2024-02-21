$(document).ready(function () {
    const csrfToken = $('meta[name=csrf-token]').attr('content');
    const submitBtn = $('#submitBtn');
    const form = $('.needs-validation');

    $.ajax({
        url: 'commission-types',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var selectElement = $('#commission_type');
            response.forEach(function (commission) {
                var optionText = commission.description;
                var option = $('<option>').val(commission.id).text(optionText);
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
            company_name: $('#company_name').val().trim(),
            owner_name: $('#owner_name').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            address: $('#address').val().trim(),
            commission_rate: $('#commission_rate').val().trim(),
            commission_type_id: $('#commission_type').val().trim(),
            bank_account_no: $('#account_no').val().trim()
        };

        const validationRules = {
            company_name: {
                required: true,
                minLength: 2,
                maxLength: 35,
                format: /^[a-zA-Z\s']+$/,
            },
            owner_name: {
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
            commission_rate: {
                required: true,
                min: 0.1,
                max: 20,
                format: /^\d+(\.\d{1,2})?$/,
            },

            commission_type_id: {
                required: true,
            },
            bank_account_no: {
                required: true,
                minLength: 5,
                maxLength: 14,
                format: /^\d+$/,
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
            company_name: $('#company_name').val(),
            owner_name: $('#owner_name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
            commission_rate: $('#commission_rate').val(),
            commission_type_id: $('#commission_type').val(),
            bank_account_no: $('#account_no').val()
        };

        $.ajax({
            url: 'company',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken,
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
        var id = $(this).data('company');
        $('#deleteModal #deleteSubmit').click(function () {
            deleteCompany(id)
        })
    });

    function deleteCompany(id) {
        $.ajax({
            url: 'company/' + id,
            type: 'delete',
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

    function loadCompanyData(companyID) {
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
                $('#editModal #account_no').val(companyData.bank_account_no);
                $('#editModal').data('company', companyID);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    $(document).on('click', '.edit-btn', function (event) {
        event.preventDefault();
        var companyID = $(this).data('company');
        loadCompanyData(companyID);
    });

    const editValidationRules = {
        company_name: {
            required: true,
            minLength: 2,
            maxLength: 35,
            format: /^[a-zA-Z\s']+$/,
        },
        owner_name: {
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
        commission_rate: {
            required: true,
            min: 1,
            max: 20,
            format: /^\d+(\.\d{1,2})?$/,
        }
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
    // Function to handle the edit form submission
    $('#editModal #editSubmitButton').click(function (e) {
        e.preventDefault();
        if (validateEditForm()) {
            var ID = $('#editModal').data('company');
            var data = {
                'company_name': $('#editModal #company_name').val(),
                'owner_name': $('#editModal #owner_name').val(),
                'email': $('#editModal #email').val(),
                'phone': $('#editModal #phone').val(),
                'address': $('#editModal #address').val(),
                'commission_rate': $('#editModal #commission_rate').val(),
                'bank_account_no': $('#editModal #account_no').val()
            };

            $.ajax({
                url: 'company/' + ID,
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
                    //alert(error);
                    console.log(error);
                    alert("There is an error");
                }
            });
        }
    });


    $('#editModal').on('shown.bs.modal', function () {

    });


    var table = $('#companies').DataTable({
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
            url: 'company',
            dataType: "json",
            type: "get",

            error: function (error) {
                alert("Error " + error);
                console.log(error)
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    dataSet.push([
                        array[i].id,
                        '<a href="/company-details/' + array[i].id + '">' + array[i].company_name + '</a>',
                        array[i].owner_name,
                        array[i].bank_account_no,
                        array[i].commission_rate + '%',
                        array[i].commission_type,
                        array[i].phone,
                        array[i].address,
                        array[i].email,
                        '<a data-bs-toggle="modal" data-bs-target="#editModal" data-company="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md edit-btn" title="Düzenle">\
                        <i class="la la-edit"></i></a>'+ '<a data-bs-toggle="modal" data-bs-target="#deleteModal" data-company="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md delete-btn" title="Sil">\
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
});
