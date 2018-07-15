import React from 'react';

const UserInfoForm = (formType) => {
  // have vars for the multiple form options
  const forms = {
    income: <div><label>Income</label><input type="number" /></div>,
    expense: <div><label>Expense</label><input type="number" /></div>,
    debt: <div><label>Debt</label><input type="number" /></div>
  };
  return (
    <div className="user-info-form">
      <form>
        {forms[formType]}
      </form>
    </div>
  );
}

export default UserInfoForm;

// form needs to be flexible enough to handle incomes, expenses, debts, etc

// basic logic of form
  // take data, store, 