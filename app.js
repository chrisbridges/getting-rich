const ALPHA_VANTAGE_API_KEY = 'YFIGM2L9A2765AB9';
const ALPHA_VANTAGE_ENDPOINT = 'https://www.alphavantage.co/query';

const incomes = [];
const expenses = [];
const investments = [];
const debts = [];

function listenForUserIncome () {
  $('#income-form').submit(function(event) {
    event.preventDefault();

    let userIncomeType = $('#income-option').val();
    let userIncomeAmount = $('#income').val();

    $('#income').val('');

    storingIncomes(userIncomeType, userIncomeAmount);
  });
}

function storingIncomes (userIncomeType, userIncomeAmount) {
  incomes.push({
    'Income Type': userIncomeType,
    'Income Amount': userIncomeAmount
  });
  displayIncomes();
}

function displayIncomes () {
  let output = '';
  incomes.map(function(income) {
    output += `${income['Income Type']}: $${income['Income Amount']}<br>`;
  });
  $('.user-income-values').html(output);
}

function listenForUserExpense () {
  $('#expense-form').submit(function(event) {
    event.preventDefault();

    let userExpenseType = $('#expense-option').val();
    let userExpenseAmount = $('#expense').val();

    $('#expense').val('');

    storingExpenses(userExpenseType, userExpenseAmount);
  });
}

function storingExpenses (userExpenseType, userExpenseAmount) {
  expenses.push({
    'Expense Type': userExpenseType,
    'Expense Amount': userExpenseAmount
  });
  displayExpenses();
}

function displayExpenses () {
  let output = '';
  expenses.map(function(expense) {
    output += `${expense['Expense Type']}: $${expense['Expense Amount']}<br>`;
  });
  $('.user-expense-values').html(output);
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
  investments.push({
    'Investment': userInvestment,
    'Amount Owned': numberOfShares
  });

  console.log(investments);
  displayInvestments();
}

function displayInvestments () {
  let output = '';
  investments.map(function(investment) {
    output += `${investment['Investment']}: ${investment['Amount Owned']}<br>`;
  });
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
    let userDebtMonthlyPayment = parseInt($('#monthly-payment').val());
    $('#debt').val('');
    $('#interest-rate').val('');
    $('#monthly-payment').val('')
    storingDebts(userDebt, userDebtAmountOwed, userDebtInterestRate, userDebtMonthlyPayment);
  });
}

function storingDebts (userDebt, userDebtAmountOwed, userDebtInterestRate, userDebtMonthlyPayment) {
  debts.push({
    'Debt Type': userDebt,
    'Amount owed': userDebtAmountOwed,
    'Interest Rate': userDebtInterestRate,
    'Monthly Payment': userDebtMonthlyPayment
  });
  console.log(debts);
  displayDebts();
}

function displayDebts () {
  let output = '';
  debts.map(function(debt) {
    output += `${debt['Debt Type']}: $${debt['Amount owed']} @ ${debt['Interest Rate']}% interest<br>Monthly Payment: $${debt['Monthly Payment']}<br>`;
  });
  $('.user-debt-values').html(output);
}

/*function summarizeResults () {
  summarizeIncomes();
  summarizeInvestments();
  summarizeExpenses();
  summarizeDebts();
}

function ticker () {
  incomePerSecond();
  investmentsPerSecond();
  expensesPerSecond();
  debtsPerSecond();
}
*/
function totalIncomePerSecond () {
  $('.income-next-section-button').on('click', function() {
    return incomes.reduce(function(total, income) {
      return total + incomePerSecond(income['Income Amount']);
    });
  });
}

function incomePerSecond(income) {
  const secondsIn30Days = 2592000;
  return income / secondsIn30Days;
}


$(listenForUserIncome);
$(listenForUserExpense);
$(listenForUserInvestments);
$(listenForUserDebts);
$(totalIncomePerSecond);