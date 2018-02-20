const ALPHA_VANTAGE_API_KEY = 'YFIGM2L9A2765AB9';
const ALPHA_VANTAGE_ENDPOINT = 'https://www.alphavantage.co/query';

const incomes = {};
const expenses = {};
const investments = {};

function addAdditionalIncomeInput () {
  const incomeSelect = `<br><select id="income-option">
        <option value="Salary / Wages">Salary / Wages</option>
        <option value="Additional Wages">Additional Wages</option>
        <option value="Pension">Pension</option>
        <option value="Social Security">Social Security</option>
        <option value="Other">Other</option>
        <label for="income"></label>
        <input type="number" min="0" name="income" id="income" placeholder="After-tax income">
      </select>
      <button type="submit">Submit</button>`;

  $('#income-form').append(incomeSelect);
}

function storingIncomeValues () {
  $('#income-form').submit(function(event) {
    event.preventDefault();
    if (incomes.hasOwnProperty($('#income-option').val())) {
      incomes[$('#income-option').val()] += parseInt($('#income').val());
    } else {
      incomes[$('#income-option').val()] = parseInt($('#income').val());
    }
    console.log(incomes);
    $('#income').val('');
  });
}

$(addAdditionalIncomeInput);
$(storingIncomeValues);