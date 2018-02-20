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

function storingInvestments () {

}

function storingDebts () {

}

$(listenForUserIncome);
$(listenForUserExpense);