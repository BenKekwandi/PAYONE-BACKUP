$(document).ready(function () {
    var csrfToken = $('meta[name=csrf-token]').attr('content');

    $.ajax({
        url: 'company',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var selectElement = $('#company');
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
        const companyIdInput = document.getElementById('company');

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
            showError(phoneInput, 'Please provide a valid Phone number.');
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


        // Validate Comission ID
        if (companyIdInput.value.trim() === '') {
            showError(companyIdInput, 'Please provide a valid Company.');
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
        validateForm(event)
    });

    editBtn.addEventListener('click', function (event) {
        validateForm(event);
    });


    var form = $('#submitBtn');
    form.submit(function (e) {
        e.preventDefault();

        var data = {
            'name': $('#name').val(),
            'surname': $('#surname').val(),
            'email': $('#email').val(),
            'phone': $('#phone').val(),
            'address': $('#address').val(),
            'company_id': $('#company').val(),
        };
        console.log(data)
        $.ajax({
            url: 'manager',
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
        var id = $(this).data('manager');




        var deleteButton = $('#deleteSubmit');

        deleteButton.click(function () {


            $.ajax({
                url: 'manager/' + id,
                type: 'DELETE',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    // console.log('Response:', response);
                    alert('Item deleted');
                },
                error: function (error) {
                    // console.error('Error:', error);
                }
            });

            location.reload();
        });
    });
    $(document).on('click', '.edit-btn', function (event) {

        event.preventDefault();

        var ID = $(this).data('manager');

        console.log(ID);

        $.ajax({
            url: 'manager/' + ID,
            type: 'GET',
            dataType: 'json',
            success: function (managerData) {
                console.log(managerData);
                $('#editModal #name').val(managerData.name);
                $('#editModal #surname').val(managerData.surname);
                $('#editModal #email').val(managerData.email);
                $('#editModal #address').val(managerData.address);
                $('#editModal #phone').val(managerData.phone);
                $('#editModal').data('manager', ID);
            },
            error: function (error) {
                console.log(error);
            }
        });

    });

    $('#editModal').on('shown.bs.modal', function () {

        var editButton = $('#editModal #editSubmit');

        editButton.click(function (e) {

            e.preventDefault();

            var ID = $('#editModal').data('manager');

            var data = {
                'name': $('#editModal #name').val(),
                'surname': $('#editModal #surname').val(),
                'email': $('#editModal #email').val(),
                'address': $('#editModal #address').val(),
                'phone': $('#editModal #phone').val(),
            };


            $.ajax({
                url: 'manager/' + ID,
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function (response) {
                    console.log(response);
                    location.reload()
                },
                error: function (error) {
                    //alert(error)
                    console.log(error);
                    //alert("Update Failed")
                }
            });


        });

    });

    var table = $('#managers').DataTable({
        responsive: true,
        scrollX: 200,
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
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        order: [[1, 'asc']],
        ajax: {
            url: 'manager',
            dataType: "json",
            error: function (request) {
                alert("Error " + request);
            },
            success: function (array) {
                var dataSet = [];
                for (var i = 0; i < array.length; i++) {
                    dataSet.push([
                        array[i].company,
                        array[i].name + ' ' + array[i].surname,
                        array[i].email,
                        array[i].phone,
                        array[i].address,
                        '<a data-bs-toggle="modal" data-bs-target="#editModal" data-manager="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md edit-btn" title="Edit details">\
                        <i class="la la-edit"></i></a>'+ '<a data-bs-toggle="modal" data-bs-target="#deleteModal" data-manager="' + array[i].id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md delete-btn" title="Delete">\
                        <i class="la la-trash"></i></a>',
                    ]);
                    console.log(dataSet);
                }
                table.clear().rows.add(dataSet).draw();
            }
        }
    });




    $('#customer tbody').on('click', '.btn-plus', function () {
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
var exampleModal = document.getElementById('delete')
exampleModal.addEventListener('show.bs.modal', function (event) {

    var button = event.relatedTarget

    var recipient = button.getAttribute('data-manager')
    var modalBodyInput = exampleModal.querySelector('.modal-body input')

    modalBodyInput.value = recipient
})