const ALPHA_VANTAGE_API_KEY = 'YFIGM2L9A2765AB9';
const ALPHA_VANTAGE_ENDPOINT = 'https://www.alphavantage.co/query';

const incomes = {};
const expenses = {};
const investments = {};
const debts = {};

function listenForUserIncome () {
  $('#income-form').submit(function(event) {
    event.preventDefault();
    storingValues(incomes, 'income');
  });
}
function listenForUserExpense () {
  $('#expense-form').submit(function(event) {
    event.preventDefault();
    storingValues(expenses, 'expense');
  });
}

function storingValues (valueObj, incomeOrExpense) {
  if (valueObj.hasOwnProperty($(`#${incomeOrExpense}-option`).val())) {
    valueObj[$(`#${incomeOrExpense}-option`).val()] += parseInt($(`#${incomeOrExpense}`).val());
  } else {
    valueObj[$(`#${incomeOrExpense}-option`).val()] = parseInt($(`#${incomeOrExpense}`).val());
  }
  console.log(valueObj);
  $(`#${incomeOrExpense}`).val('');
  displayValues(valueObj, incomeOrExpense);
}

function displayValues (valueObj, incomeOrExpense) {
  let output = '';
  for (var prop in valueObj) {
    output += `${prop} - $${valueObj[prop]}<br>`;
  }
  $(`.user-${incomeOrExpense}-values`).html(output);
}

function listenForUserInvestments () {
  $('#investment-form').submit(function(event) {
    event.preventDefault();
    let userInvestment = $('#investment').val().toUpperCase();
    const params = {
      function: 'TIME_SERIES_INTRADAY',
      symbol: userInvestment,
      interval: '1min',
      apikey: ALPHA_VANTAGE_API_KEY
    };
  //let stock = userInput
  // use .fail for errors
    let investmentData = $.getJSON(ALPHA_VANTAGE_ENDPOINT, params, storingInvestments(userInvestment)).fail(investmentError);
    console.log(investmentData);
  });
}

function storingInvestments (userInvestment) {
  //only store valid investments. Check for errors on the listening func before storing
  investments[userInvestment] = userInvestment;
  console.log(investments);
}

function investmentError () {
  console.log('Sorry. We\'re having trouble finding that investment right now.');
}

function listenForUserDebts () {

}

function storingDebts () {

}

$(listenForUserIncome);
$(listenForUserExpense);
$(listenForUserInvestments);