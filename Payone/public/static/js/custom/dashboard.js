$(document).ready(function () {

  let isFetching = false;

  function updateElementWithColor(elementId, value) {
    const color = value < 0 ? 'white' : 'white';
    const formattedValue = value < 0 ? value.toString() : `+${value}`;
    const html = `<span style="color: ${color}">${formattedValue}</span>`;
    $(elementId).html(html);
  }

  function updatePriceElement(elementId, price) {
    // const formattedPrice = parseFloat(price).toFixed(3);
    const formattedPrice = parseFloat(price).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    $(elementId).html(formattedPrice);
  }

  function fetchDataAndUpdateUI() {
    $.ajax({
      url: 'exchange-rate',
      type: 'GET',
      contentType: 'application/json',
      success: function (response) {
        if (response) {
          const trades = {};
          const elements = {};
          const prices = {};

          response.forEach(function (rate) {
            trades[rate.symbol] = rate.priceChangePercent;
            prices[rate.symbol] = rate.lastPrice;
          });

          updateElementWithColor('#eth_percentage', trades['ETHTRY']);
          updateElementWithColor('#btc_percentage', trades['BTCTRY']);
          updateElementWithColor('#ltc_percentage', trades['TRXTRY']);
          updateElementWithColor('#usdt_percentage', trades['USDTTRY']);

          updatePriceElement('#eth_price', prices['ETHTRY']);
          updatePriceElement('#btc_price', prices['BTCTRY']);
          updatePriceElement('#ltc_price', prices['TRXTRY']);
          updatePriceElement('#usdt_price', prices['USDTTRY']);
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  function throttleFetchDataAndUpdateUI() {
    if (!isFetching) {
      isFetching = true;
      fetchDataAndUpdateUI();

      setTimeout(function () {
        isFetching = false;
      }, 5000);
    }
  }

  throttleFetchDataAndUpdateUI();

  setInterval(throttleFetchDataAndUpdateUI, 3000);


});