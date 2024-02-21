$(document).ready(function () {

  $('#result').hide();

  if (!$('#amount').val()) {
    $('#amount').val(0);
  }

  if (!$('#amount2').val()) {
    $('#amount2').val(0);
  }

  var conversionRates = {};

  $.ajax({
    url: 'exchange-price',
    type: 'GET',
    contentType: 'application/json',
    success: function (response) {
      // console.log(response)
      if (response) {
        response.forEach(function (rate) {
          conversionRates[rate.symbol] = parseFloat(rate.price);
        });
        conversionRates['USDTUSDT'] = 1 / 0.999475;
        conversionRates['USDTEUR'] = 1 / conversionRates['EURUSDT'];
        conversionRates['USDTGBP'] = 1 / conversionRates['GBPUSDT'];
        $('#submitBtn').click(function (event) {

          $('#result').empty();


          if ($('#fromCurrency').val() && $('#toCurrency').val() && $('#amount').val()) {
            var conv = $('#fromCurrency').val() + $('#toCurrency').val();

            var amount = parseFloat($('#amount').val()) || 0;
            var res = 0;

            if (conv in conversionRates) {
              res = amount / (parseFloat(conversionRates[conv]));
              var rslt = `<p>` + amount.toString() + ' ' + $('#toCurrency').val() + ' = ' + `</p>`
                + `<h1 style="font-weight:bolder">` + res.toString() + ' ' + $('#fromCurrency').val() + `</h1>`
                + `<p>` + '1 ' + $('#fromCurrency').val() + ' = ' + conversionRates[conv] + ' ' + $('#toCurrency').val() + `</p>`
                + `<p>` + '1 ' + $('#toCurrency').val() + ' = ' + (1 / parseFloat(conversionRates[conv])).toString() + ' ' + $('#fromCurrency').val() + `</p>`;
              $('#result').append(rslt);
              $('#result').show();
            }
            else {
              alert('There is an API issue');
            }


          }
          else {
            alert('Enter the Amount and select the currencies');
          }

        });

      }
    },
    error: function (error) {
      console.error('Error:', error);
    }
  });



});
