$(document).ready(function () {

    const csrfToken = $('meta[name=csrf-token]').attr('content');


    TrncOption = $('<option>').val('KKTC').text('KKTC');
    $('#country').append(TrncOption);
    TrncCities = ['Lefkoşa', 'Girne', 'Gazimağusa', 'İskele']
    var countries = ['Turkey']
    $.each(countries, function (index, item) {
        var option = $('<option>').val(item).text(item);
        $('#country').append(option)
    });

    $.ajax({
        url: 'https://countriesnow.space/api/v0.1/countries',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {

            $('#city').empty();

            if ($('#country').val() == 'KKTC') {
                $.each(TrncCities, function (index, item) {
                    var option = $('<option>').val(item).text(item);
                    $('#city').append(option)
                })
            }
            else {
                if (Array.isArray(response.data)) {

                    $.each(response.data, function (index, item) {

                        if (item.country === $('#country').val()) {

                            $.each(item.cities, function (city_index, city_item) {
                                var city_option = $('<option>').val(city_item).text(city_item);
                                $('#city').append(city_option)
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


    $('#country').on('change', function (e) {

        $.ajax({
            url: 'https://countriesnow.space/api/v0.1/countries',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {

                $('#city').empty();

                if ($('#country').val() == 'KKTC') {
                    $.each(TrncCities, function (index, item) {
                        var option = $('<option>').val(item).text(item);
                        $('#city').append(option)
                    })
                }
                else {
                    if (Array.isArray(response.data)) {

                        $.each(response.data, function (index, item) {

                            if (item.country === $('#country').val()) {

                                $.each(item.cities, function (city_index, city_item) {
                                    var city_option = $('<option>').val(city_item).text(city_item);
                                    $('#city').append(city_option)
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

    $('#applicationForm').submit(function () {

        alert('Application successfully submitted');

    });






});
