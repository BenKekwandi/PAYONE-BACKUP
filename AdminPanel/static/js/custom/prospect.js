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

    TrncOption = $('<option>').val('KKTC').text('KKTC');
    $('#exampleModal #country').append(TrncOption);

    var countries = ['Turkey']
    $.each(countries, function (index, item) {
        var option = $('<option>').val(item).text(item);
        $('#exampleModal #country').append(option)
    });

    TrncCities = ['Lefkoşa', 'Girne', 'Gazimağusa', 'İskele']

    $.ajax({
        url: 'https://countriesnow.space/api/v0.1/countries',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {

            $('#exampleModal #city').empty();

            if ($('#exampleModal #country').val() == 'KKTC') {
                $.each(TrncCities, function (index, item) {
                    var option = $('<option>').val(item).text(item);
                    $('#exampleModal #city').append(option)
                })
            }
            else {
                if (Array.isArray(response.data)) {

                    $.each(response.data, function (index, item) {

                        if (item.country === $('#exampleModal #country').val()) {

                            $.each(item.cities, function (city_index, city_item) {
                                var city_option = $('<option>').val(city_item).text(city_item);
                                $('#exampleModal #city').append(city_option)
                            })
                        }
                    });
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

    $('#exampleModal #country').on('change', function (e) {

        $.ajax({
            url: 'https://countriesnow.space/api/v0.1/countries',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {

                $('#exampleModal #city').empty();

                if ($('#exampleModal #country').val() == 'KKTC') {
                    $.each(TrncCities, function (index, item) {
                        var option = $('<option>').val(item).text(item);
                        $('#exampleModal #city').append(option)
                    })
                }
                else {
                    if (Array.isArray(response.data)) {

                        $.each(response.data, function (index, item) {

                            if (item.country === $('#exampleModal #country').val()) {

                                $.each(item.cities, function (city_index, city_item) {
                                    var city_option = $('<option>').val(city_item).text(city_item);
                                    $('#exampleModal #city').append(city_option)
                                })
                            }
                        });
                    }
                }
            },
            error: function (error) {
                console.log(error);
            }
        });

    });




    function validateForm() {
        clearErrorMessages();

        const formData = {
            company_name: $('#exampleModal #company_name').val(),
            company_address: $('#exampleModal #company_address').val(),
            email: $('#exampleModal #email').val(),
            phone: $('#exampleModal #phone').val(),
            business_registration_number: $('#exampleModal #registration_number').val(),
            contact_person: $('#exampleModal #contact_person').val(),
            country: $('#exampleModal #country').val(),
            city: $('#exampleModal #city').val(),
            website: $('#exampleModal #website').val(),
            postal_code: $('#exampleModal #postal_code').val()
        };

        const validationRules = {
            company_name: {
                required: true,
                minLength: 2,
                maxLength: 35,
                format: /^[a-zA-Z\s']+$/,
            },
            company_address: {
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
            business_registration_number: {
                required: true,
                minLength: 5,
                maxLength: 35,
                format: /^\d+$/,
            },
            contact_person: {
                required: true,
                minLength: 2,
                maxLength: 35,
                format: /^[a-zA-Z\s']+$/,
            },
            country: {
                required: true,
                minLength: 2,
                maxLength: 35,
                format: /^[a-zA-Z\s']+$/,
            },
            city: {
                required: true,
                minLength: 2,
                maxLength: 35,
                format: /^[a-zA-Z\s']+$/,
            },
            website: {
                required: true,
                minLength: 2,
                maxLength: 255,
                format: /.*/

            },
            postal_code: {
                required: true,
                minLength: 2,
                maxLength: 7,
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
            company_address: $('#company_address').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            business_registration_number: $('#registration_number').val(),
            contact_person: $('#contact_person').val(),
            country: $('#country').val(),
            city: $('#city').val(),
            website: $('#website').val(),
            postal_code: $('#postal_code').val(),
            status: 0
        };

        $.ajax({
            url: 'prospect',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken,
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
        var id = $(this).data('prospect');
        console.log('Prospect Id')
        console.log($(this).data('prospect'))

        $('#deleteModal #deleteSubmit').click(function () {
            deleteProspect(id)
        })
    });

    function deleteProspect(id) {
        $.ajax({
            url: 'prospect/' + id,
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

    function loadProspectData(companyID) {
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
    // Function to handle the edit form submission
    $('#editModal #editSubmitButton').click(function () {
        if (validateEditForm()) {
            var ID = $('#editModal').data('prospect');
            var data = {
                'company_name': $('#company_name').val(),
                'company_address': $('#company_address').val(),
                'email': $('#email').val(),
                'phone': $('#phone').val(),
                'business_registration_number': $('#registration_number').val(),
                'contact_person': $('#contact_person').val(),
                'country': $('#country').val(),
                'city': $('#city').val(),
                'website': $('#website').val(),
                'postal_code': $('#postal_code').val()
            };

            $.ajax({
                url: 'prospect/' + ID,
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


    var table = $('#prospects').DataTable({
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
            url: 'prospect',
            dataType: "json",
            type: "get",
            error: function (request) {
                alert("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    dataSet.push([
                        array[i].id,
                        array[i].registration_date,
                        array[i].company_name,
                        array[i].country + '/' + array[i].city,
                        array[i].address,
                        array[i].post_code,
                        array[i].phone,
                        array[i].email,
                        array[i].contact_person,
                        array[i].business_registration_number,
                        array[i].website,
                        '<a class="btn btn-sm btn-clean btn-icon btn-icon-md register-btn" href="prospect-application/' + array[i].id + '"><i class="fa-solid fa-angles-right" title="Oluştur"></i></a>' +
                        '<a class="btn btn-sm btn-clean btn-icon btn-icon-md form-btn" href="prospect-document/' + array[i].id + '"><i class="fa-solid fa-file" title="Kontract"></i></a>' +
                        '<a data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn btn-sm btn-clean btn-icon btn-icon-md delete-btn" data-prospect="' + array[i].id + '"><i class="fa-solid fa-trash" title="Sil"></i></a>'
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
