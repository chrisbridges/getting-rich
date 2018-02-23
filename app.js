const ALPHA_VANTAGE_API_KEY = 'YFIGM2L9A2765AB9';
const ALPHA_VANTAGE_ENDPOINT = 'https://www.alphavantage.co/query';

const incomes = [];
const expenses = [];
const investments = [];
const debts = [];

const secondsIn30Days = 2592000;
const removeElementButton = `<button class="remove-element-button">X</button>`;

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
    output += `<li>${income['Income Type']}: $${income['Income Amount']}${removeElementButton}</li>`;
  });
  $('.user-income-list').html(output);
  displayIncomePerSecond();
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
    output += `<li>${expense['Expense Type']}: $${expense['Expense Amount']}${removeElementButton}</li>`;
  });
  $('.user-expense-values').html(output);
  displayExpensePerSecond();
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
    output += `<li>${investment['Investment']}: ${investment['Amount Owned']}${removeElementButton}</li>`;
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
    let userDebtAmountOwed = parseInt($('#debt').val());
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
    'Amount Owed': userDebtAmountOwed,
    'Interest Rate': userDebtInterestRate,
    'Monthly Payment': userDebtMonthlyPayment
  });
  console.log(debts);
  displayDebts();
}

function displayDebts () {
  let output = '';
  debts.map(function(debt) {
    output += `<li>${debt['Debt Type']}: $${debt['Amount Owed']} @ ${debt['Interest Rate']}% interest<br>Monthly Payment: $${debt['Monthly Payment']}${removeElementButton}</li>`;
  });
  $('.user-debt-values').html(output);
  displayDebtPerSecond();
}

function ticker () {
  let tickerValue = 0;
  function incrementTicker () {
    tickerValue += totalIncomePerSecond() - totalExpensesPerSecond() - totalDebtPerSecond() - totalDebtPaymentPerSecond();
    $('.ticker').html(`$ ${tickerValue.toFixed(5)}`);
  }
  setInterval(incrementTicker, 1000);
}

function totalIncomePerSecond () {
  return incomes.reduce(function(total, income) {
    return total + incomePerSecond(income['Income Amount']);
  }, 0);
}

function incomePerSecond(income) {
  return income / secondsIn30Days;
}

function totalExpensesPerSecond () {
  return expenses.reduce(function(total, expense) {
    return total + expensesPerSecond(expense['Expense Amount']);
  }, 0);
}

function expensesPerSecond (expense) {
  return expense / secondsIn30Days;
}

function totalDebtPerSecond () {
  return debts.reduce(function(total, debt) {
    return total + debtPerSecond(debt['Amount Owed'], debt['Interest Rate']);
  }, 0);
}

function debtPerSecond (principal, interestRate) {
  const monthsInYear = 12;
  const compoundDaily = 365;
  const oneYear = 1;
  return compoundInterestFormula(principal, interestRate, compoundDaily, oneYear) / monthsInYear / secondsIn30Days;
}

function totalDebtPaymentPerSecond () {
  return debts.reduce(function(total, debt) {
    return total + debtPaymentPerSecond(debt['Monthly Payment']);
  }, 0);
}

function debtPaymentPerSecond (monthlyPayment) {
  return monthlyPayment / secondsIn30Days;
}

function compoundInterestFormula (principal, interestRate, compoundRatePerYear, lengthOfDebtInYears) {
  //calculates interest sans principal amount
  return principal * Math.pow((1 + (interestRate / 100) / compoundRatePerYear), (compoundRatePerYear * lengthOfDebtInYears)) - principal;
}

function totalInvestmentsPerSecond () { // look up how to handle a 503 error

}

function investmentsPerSecond () {

}

function displayIncomePerSecond () {
  let output = '';
  let incomesPer = incomes.map(function(income) {
    let incomePer = incomePerSecond(income['Income Amount']);
    output += `<li>${income['Income Type']}: $${incomePer.toFixed(5)}</li>`;
  });
  $('.income-list').html(output);
  $('.income-total').html(totalIncomePerSecond().toFixed(5));
}

function displayExpensePerSecond () {
  let output = '';
  let expensesPer = expenses.map(function(expense) {
    let expensePer = expensesPerSecond(expense['Expense Amount']);
    output += `<li>${expense['Expense Type']}: $${expensePer.toFixed(5)}</li>`;
  });
  $('.expense-list').html(output);
  $('.expense-total').html(totalExpensesPerSecond().toFixed(5));
}

function displayDebtPerSecond () {
  let output = '';
  let debtsPer = debts.map(function(debt) {
    let debtPer = debtPerSecond(debt['Amount Owed'], debt['Interest Rate']);
    output += `<li>${debt['Debt Type']} Interest: $${debtPer.toFixed(5)}<br>
      Monthly Payment: ${debtPaymentPerSecond(debt['Monthly Payment']).toFixed(5)}</li>`;
  });
  $('.debt-list').html(output);
  $('.debt-total').html((totalDebtPerSecond() + totalDebtPaymentPerSecond()).toFixed(5));
}

function removeUserEntryIncome () {
  $('.user-income-list').on('click', '.remove-element-button', function(event) {
    console.log($(this).closest('li').index());
    $(this).closest('li').remove();
    incomes.splice($(this).closest('li').index(), 1);
    displayIncomePerSecond();
  });
}

function removeUserEntryExpense () {
  $('.user-expense-list').on('click', '.remove-element-button', function(event) {
    console.log($(this).closest('li').index());
    $(this).closest('li').remove();
    expenses.splice($(this).closest('li').index(), 1);
    displayExpensePerSecond();
  });
}

function removeUserEntryInvestments () {
  $('.user-investment-list').on('click', '.remove-element-button', function(event) {
    console.log($(this).closest('li').index());
    $(this).closest('li').remove();
    investments.splice($(this).closest('li').index(), 1);
    displayInvestmentPerSecond();
  });
}

function removeUserEntryDebts () {
  $('.user-debt-list').on('click', '.remove-element-button', function(event) {
    console.log($(this).closest('li').index());
    $(this).closest('li').remove();
    debts.splice($(this).closest('li').index(), 1);
    displayDebtPerSecond();
  });
}

$(listenForUserIncome);
$(listenForUserInvestments);
$(listenForUserExpense);
$(listenForUserDebts);
$(ticker);
$(displayIncomePerSecond);
$(displayExpensePerSecond);
$(displayDebtPerSecond);
$(removeUserEntryIncome);
$(removeUserEntryExpense);
$(removeUserEntryInvestments);
$(removeUserEntryDebts);

