const ALPHA_VANTAGE_API_KEY = 'YFIGM2L9A2765AB9';
const ALPHA_VANTAGE_ENDPOINT = 'https://www.alphavantage.co/query';

const incomes = [];
const expenses = [];
const investments = [];
const cryptos = [];
const debts = [];

const secondsIn30Days = 2592000;
const removeElementButton = `<button class="remove-element-button">X</button>`;

function timePageLoadedEST () {

  const currentDate = new Date();
  const dayOfTheWeek = currentDate.getDay();
  let hour = currentDate.getHours();
  let minute = currentDate.getMinutes();
  let second = currentDate.getSeconds();
  let month = currentDate.getMonth() + 1; // month values are 0-indexed
  let date = currentDate.getDate();
  const year = currentDate.getFullYear();

  function calibrateLocalTimetoEST () {
    const desiredDifferenceInMinutesBetweenTimeZones = 300; // UTC is 5 hours ahead of EST
    let differenceInMinutesBetweenTimeZones = currentDate.getTimezoneOffset();
    if (differenceInMinutesBetweenTimeZones > desiredDifferenceInMinutesBetweenTimeZones) {
      while (differenceInMinutesBetweenTimeZones > desiredDifferenceInMinutesBetweenTimeZones) {
        hour += 1;
        differenceInMinutesBetweenTimeZones -= 60;
      }
      minute -= (differenceInMinutesBetweenTimeZones - desiredDifferenceInMinutesBetweenTimeZones);
    }
    if (differenceInMinutesBetweenTimeZones < desiredDifferenceInMinutesBetweenTimeZones) {
      while (differenceInMinutesBetweenTimeZones < desiredDifferenceInMinutesBetweenTimeZones) {
        hour -= 1;
        differenceInMinutesBetweenTimeZones += 60;
      }
       minute -= (differenceInMinutesBetweenTimeZones - desiredDifferenceInMinutesBetweenTimeZones);
    }
  }

  calibrateLocalTimetoEST();

  function areMarketsClosed () {
    const isWeekDay = dayOfTheWeek >= 1 && dayOfTheWeek <= 5;

    if (isWeekDay === 1 && (hour <= 9 && minute <= 30)) { // if Monday before opening, knock it back to Friday close
      date -= 3;
      currentTimeWithPadding = `16:00:00`;
    } else if (isWeekDay && (hour <= 9 && minute <= 30)) { // if markets are not open yet, stock price is pegged at previous day's close
      currentTimeWithPadding = `16:00:00`;
      date -= 1;
    } else if (isWeekDay && (hour > 16)) { // if market has already closed, price is set at closing price
      currentTimeWithPadding = `16:00:00`;
    }

    if (dayOfTheWeek === 6) { // if Sat/Sun, peg price to previous Fri close
      date -= 1;
      currentTimeWithPadding = `16:00:00`;
    }
    if (dayOfTheWeek === 0) {
      date -= 2;
      currentTimeWithPadding = `16:00:00`;
    }
  }

  function addPadding (time) {
    if (time < 10) {
      time = '0' + time;
    }
    return time;
  }

  let currentTimeWithPadding = `${addPadding(hour)}:${addPadding(minute)}:00`; // price times are always at 00 seconds

  areMarketsClosed();

  let currentDateWithPadding = `${year}-${addPadding(month)}-${addPadding(date)}`;
  let currentTimeAndDateWithPadding = `${currentDateWithPadding} ${currentTimeWithPadding}`;

  console.log(currentTimeAndDateWithPadding);
  return currentTimeAndDateWithPadding;
}

function timePageLoadedUTC () {
  const currentDate = new Date();
  const hour = currentDate.getUTCHours();
  let minute = currentDate.getUTCMinutes();
  const second = currentDate.getUTCSeconds();
  const month = currentDate.getUTCMonth() + 1; // month values are 0-indexed
  const date = currentDate.getUTCDate();
  const year = currentDate.getUTCFullYear();

  function addPadding (time) {
    if (time < 10) {
      time = '0' + time;
    }
    return time;
  }

  function roundMinuteToNearest5 () { // crypto prices refresh every 5 minutes
    minute = Math.floor(minute / 5) * 5; // minute needs to be held at last 5 until next value of 5
  }

  roundMinuteToNearest5();

  const currentTimeWithPadding = `${addPadding(hour)}:${addPadding(minute)}:00`; // price times are always at 00 seconds
  const currentDateWithPadding = `${year}-${addPadding(month)}-${addPadding(date)}`;
  const currentTimeAndDateWithPadding = `${currentDateWithPadding} ${currentTimeWithPadding}`;

  console.log(currentTimeAndDateWithPadding);
  return currentTimeAndDateWithPadding;
}

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
  $('.user-expense-list').html(output);
  displayExpensePerSecond();
}

function listenForUserInvestments () {
  $('#investment-form').submit(function(event) {
    event.preventDefault();

    if ($('#investment-option').val() === "Stocks") {
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

      let sharePriceOnCall = $.getJSON(ALPHA_VANTAGE_ENDPOINT, params).done(function (data) {
        const price = data['Time Series (1min)'][timePageLoadedEST()]['4. close'];
        console.log(price);
        storingInvestments(userInvestment, numberOfShares, price);
      }); 
    }


    if ($('#investment-option').val() === "Crypto") {
      let userInvestment = $('#investment').val().toUpperCase();
      let numberOfShares = $('#investment-quantity').val();
      $('#investment').val('');
      $('#investment-quantity').val('');

      const params = {
        function: 'DIGITAL_CURRENCY_INTRADAY',
        symbol: userInvestment,
        market: 'USD',
        apikey: ALPHA_VANTAGE_API_KEY
      };

      let sharePriceOnCall = $.getJSON(ALPHA_VANTAGE_ENDPOINT, params).done(function (data) {
        const price = data['Time Series (Digital Currency Intraday)'][timePageLoadedUTC()]['1a. price (USD)'];
        console.log(price);
        storingCryptos(userInvestment, numberOfShares, price);
      }); 
    }
  });
}

function storingInvestments (userInvestment, numberOfShares, price) {
  investments.push({
    'Investment': userInvestment,
    'Amount Owned': numberOfShares,
    'Price on Call': price
  });

  console.log(investments);
  displayInvestments();
}

function storingCryptos (userInvestment, numberOfShares, price) {
  cryptos.push({
    'Investment': userInvestment,
    'Amount Owned': numberOfShares,
    'Price on Call': price
  });

  console.log(cryptos);
  displayCryptos();
}

function displayInvestments () {
  let output = '';
  investments.map(function(investment) {
    output += `<li>${investment['Investment']}: ${investment['Amount Owned']} shares @ ${investment['Price on Call']}${removeElementButton}</li>`;
  });
  $('.user-investment-list').html(output);
}

function displayCryptos () {
  let output = '';
  cryptos.map(function(crypto) {
    output += `<li>${crypto['Investment']}: ${crypto['Amount Owned']} coins @ ${crypto['Price on Call']}${removeElementButton}</li>`;
  });
  $('.user-crypto-list').html(output);
}

function investmentError () {
  console.log('Sorry. We\'re having trouble finding that investment right now. Please try again');
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
  $('.user-debt-list').html(output);
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

function totalInvestmentPerMinute () { // max price refresh is 1 min for Alpha Vantage

}

function investmentPerMinute (investment) {
  const params = {
      function: 'TIME_SERIES_INTRADAY',
      symbol: investment['Investment'],
      interval: '1min',
      apikey: ALPHA_VANTAGE_API_KEY
  };

  let currentPrice = $.getJSON(ALPHA_VANTAGE_ENDPOINT, params).done(function (data) {
      return data['Time Series (1min)'][timePageLoadedEST()]['4. close'];
    }).error(investmentError); 
  console.log(currentPrice - investment['Price on Call']);
  return currentPrice - investment['Price on Call'];
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

function removeUserEntryIncome () { // remove funcs only working for income. What's that about?
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
    //displayInvestmentPerSecond();
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

$(timePageLoadedEST);
$(timePageLoadedUTC);
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

