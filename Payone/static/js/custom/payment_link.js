$(document).ready(function () {
  const csrfToken = $('meta[name=csrf-token]').attr('content');

  // if ($('#commission_type').val() == '1') {
  //   $('#commissionDiv').hide()
  // }

  let res = 0;
  let exchange_rate;
  let goingamount;
  const conversionRates = {};

  $.ajax({
    url: 'exchange-price',
    type: 'GET',
    contentType: 'application/json',
    success: function (response) {
      // console.log(response)
      for (const item of response) {
        conversionRates[item.symbol] = item.price;
      }
    },
    error: function (error) {
      console.log(error);
    }
  });

  $('#result').hide();
  $('#amount').val(0);

  $("#calculate").on("click", function (event) {
    event.preventDefault();
    if ($('#amount').val() != 0)
      performCalculation();
  });

  $("#crypto, #network, #banknotes, #amount").on("change", performCalculation);

  $("#crypto").change(function () {
    var selectedCoin = $(this).val();
    switch (selectedCoin) {
      case "BTC":
        $('#network').val("BTC");
        $('#network').prop('disabled', true);
        break;
      case "ETH":
        $('#network').val("ERC20");
        $('#network').prop('disabled', true);
        break;
      case "USDT":
        $('#network').val("TRC20");
        $('#network').find('option[value="BTC"]').prop('disabled', true);
        $('#network').prop('disabled', false);
        break;
      case "TRX":
        $('#network').val("TRC20");
        $('#network').prop('disabled', true);
        break;
      default:
        $('#network').prop('disabled', false);
        break;
    }
  });

  function performCalculation() {
    $('#result').empty();

    const cryptoVal = $('#crypto').val();
    const banknotesVal = $('#banknotes').val();
    let amountbefore = $('#amount').val() || 0;
    // console.log(amountbefore)
    const amountVal = parseFloat(amountbefore.replace(/\./g, ''));
    goingamount = amountVal;

    let commissionRate = parseFloat($('#commission').val());
    commissionRate /= 100;
    const commissionAmount = amountVal * commissionRate;
    let amountWithCommission = 0;

    if ($('#commission_type').val() == '2') {
      amountWithCommission = amountVal + commissionAmount;
    }
    else {
      amountWithCommission = amountVal;
    }
    // console.log('Commission Rate: ' + commissionRate)
    // console.log('Commission Amount: ' + commissionAmount)
    // console.log('Full Amount: ' + amountWithCommission)


    if (!cryptoVal || !banknotesVal || isNaN(amountVal) || $('#amount').val() === '0') {
      $('#result').hide();
      $('#calculate').show();
      $('#submitBtn').addClass('d-none');
      return; // Exit if any required input is missing or amount is not a number
    }

    const conv = cryptoVal + banknotesVal;
    if (conversionRates[conv] != undefined) {
      exchange_rate = parseFloat(conversionRates[conv]);
      res = amountWithCommission / exchange_rate;

      let amountDollar = conversionRates[cryptoVal + "USDT"] * res;
      let amountPound = conversionRates[cryptoVal + "GBP"];

      if (cryptoVal === 'USDT') {
        amountDollar = res;
        amountPound = conversionRates["GBP" + cryptoVal];
        amountPound = res / amountPound;
        var multiplier = Math.pow(10, 6);
        var roundedNumber = Math.ceil(res * multiplier) / multiplier;
        res = roundedNumber;
      } else {
        amountPound *= res;
      }
      let rslt = `<p>${res.toFixed(8)} ${cryptoVal} ( ${amountDollar.toFixed(2)} USD)</p>`;
      rslt

      $('#result').empty().append(rslt).show();
      $('#calculate').hide();
      $('#submitBtn').removeClass('d-none');
    } /*else {
      alert('There is an API issue');
    }*/
  }

  $('#create_qr').on('click', function () {
    const data = {
      'expected_amount': goingamount,
      'coin': $('#crypto').val(),
      'network': $('#network').val(),
      'banknote': $('#banknotes').val(),
      'exchange_rate': exchange_rate,
      'commission_rate': parseFloat($('#commission').val()),
      'expected_crypto': res.toFixed(8),
      'identification': $('#identification').val()
    };

    $.ajax({
      url: 'generate-code',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        'X-CSRFToken': csrfToken
      },
      success: function (response) {
        console.log(response)
        if (response && response.redirect_url) {
          window.location.href = response.redirect_url;
        }
      },
      error: function (error) {
        console.error(error);
      }
    });
  });
});
