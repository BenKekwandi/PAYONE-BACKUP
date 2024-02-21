$(document).ready(function () {

    const csrfToken = $('meta[name=csrf-token]').attr('content');
    
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

    $.ajax({
        url: 'prospect/' + $('#prospectId').val(),
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response)
            $('#companyForm #company_name').val(response['company_name'])
            $('#companyForm #contact_person').val(response['contact_person'])
            $('#companyForm #email').val(response['email'])
            $('#companyForm #phone').val(response['phone'])
            $('#companyForm #company_address').val(response['address'])
            $('#companyForm #website').val(response['website'])
            $('#companyForm #business_registration_number').val(response['business_registration_number'])
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });



});