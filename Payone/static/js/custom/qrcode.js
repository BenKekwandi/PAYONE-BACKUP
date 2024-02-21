$(document).ready(function () {
    // Get the text from the d
    const accessToken = $('#token').val();
    const csrfToken = $('meta[name=csrf-token]').attr('content');

    // alert('Testing...')
    // var banknote_value = $('#banknote_amount').text();
    // var crypto_amount = $('#crypto_amount').text();
    // $('#crypto_amount').text(new Intl.NumberFormat('de-DE', {
    //     minimumFractionDigits: 6,
    //     maximumFractionDigits: 8
    // }).format(crypto_amount));
    // var numericValue = parseFloat(banknote_value.replace(/[,]/g, ''));
    // banknote_value = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // var numericValue = new Intl.NumberFormat('de-DE').format(banknote_value);

    // $('#banknote_amount').text(numericValue);

    $("#copyButton").click(function () {

        var addressText = $("#address").text();

        var $tempTextarea = $("<textarea>");
        $("body").append($tempTextarea);
        $tempTextarea.val(addressText).select();

        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("Unable to copy to clipboard:", err);
        }

        $tempTextarea.remove();
    });
    $("#cancelBtn").click(function (e) {
        var data = {
            'id': $('#refrence').val(),
        };
        $.ajax({
            url: '/generate-code',
            type: 'delete',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${accessToken}`,
            },
            success: function (response) {
                window.location.href = '/secret';
            },
            error: function (error) {
                console.error(error);
            }

        });
    });

});