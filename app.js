const ALPHA_VANTAGE_API_KEY = 'YFIGM2L9A2765AB9';
const ALPHA_VANTAGE_ENDPOINT = 'https://www.alphavantage.co/query';

const incomes = {};
const expenses = {};
const investments = {};
const debts = [];

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
  for (let prop in valueObj) {
    output += `${prop} - $${valueObj[prop]}<br>`;
  }
  $(`.user-${incomeOrExpense}-values`).html(output);
}

function listenForUserInvestments () {
  $('#investment-form').submit(function(event) {
    event.preventDefault();
    let userInvestment = $('#investment').val().toUpperCase();
    let numberOfShares = $('#investment-quantity').val();
    $('#investment').val('');
    $('#investment-quantity').val('');

    const params = {
      function: 'TIME_SERIES_INTRADAY',
      symbol: userInvestment,
      interval: '1min',
      apikey: ALPHA_VANTAGE_API_KEY
    };

    let investmentData = $.getJSON(ALPHA_VANTAGE_ENDPOINT, params, storingInvestments(userInvestment, numberOfShares)).fail(investmentError);
    console.log(investmentData);
  });
}

function storingInvestments (userInvestment, numberOfShares) {
  if (investments.hasOwnProperty(userInvestment)) {
    investments[userInvestment] += parseInt(numberOfShares);
  } else {
    investments[userInvestment] = parseInt(numberOfShares);
  }
  console.log(investments);
  displayInvestments();
}

function displayInvestments () {
  let output = '';
  for (let prop in investments) {
    output += `${investments[prop]} shares of ${prop}<br>`;
  }
  $('.user-investment-values').html(output);
}

function investmentError () {
  console.log('Sorry. We\'re having trouble finding that investment right now.');
}

function listenForUserDebts () {
  $('#debt-form').submit(function(event) {
    event.preventDefault();
    let userDebt = $('#debt-option').val();
    let userDebtAmountOwed = $('#debt').val();
    let userDebtInterestRate = parseInt($('#interest-rate').val());
    $('#debt').val('');
    $('#interest-rate').val('');
    storingDebts(userDebt, userDebtAmountOwed, userDebtInterestRate);
  });
}

function storingDebts (userDebt, userDebtAmountOwed, userDebtInterestRate) {
  debts.push({
    'Debt Type': userDebt,
    'Amount owed': userDebtAmountOwed,
    'Interest Rate': userDebtInterestRate
  });
  console.log(debts);
}

function summarizeResults () {
  summarizeIncomes();
  summarizeInvestments();
  summarizeExpenses();
  summarizeDebts();
}



$(listenForUserIncome);
$(listenForUserExpense);
$(listenForUserInvestments);
$(listenForUserDebts);