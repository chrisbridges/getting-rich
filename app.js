const ALPHA_VANTAGE_API_KEY = 'YFIGM2L9A2765AB9';
const ALPHA_VANTAGE_ENDPOINT = 'https://www.alphavantage.co/query';

const incomes = {};
const expenses = {};
const investments = {};

function addAdditionalIncomeInput () {
  const incomeSelect = `<br><select>
        <option value="0">Salary / Wages</option>
        <option value="1">Additional Wages</option>
        <option value="2">Pension</option>
        <option value="3">Social Security</option>
        <option value="4">Other</option>
        <label for="income"></label>
        <input type="number" min="0" step="100" name="income" id="income" placeholder="After-tax income">
      </select>`;

  $('.add-additional').on('click', function() {
    $('#income-form').append(incomeSelect);
  });
}

function storingIncomeValues () {
  
}

$(addAdditionalIncomeInput);