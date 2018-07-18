// const UserInfoForm = (formType) => {
//   // have vars for the multiple form options
//   const forms = {
//     income: <div><label>Income</label><input type="number" /></div>,
//     expense: <div><label>Expense</label><input type="number" /></div>,
//     debt: <div><label>Debt</label><input type="number" /></div>
//   };
//   return (
//     <div className="user-info-form">
//       <form>
//         {forms[formType]}
//       </form>
//     </div>
//   );
// }

// export default UserInfoForm;

// form needs to be flexible enough to handle incomes, expenses, debts, etc

// basic logic of form
  // take data, store, 
  // forms will have same addInput and removeInput behavior

// props to be passed to HOC - name (income, etc), options (salary, rent, etc), 
import React from 'react';

const forms = {
  income: {title: 'Income', options: ['Salary', 'Side Hustle'], interest: false},
  expense: {title: 'Expense', options: ['Rent', 'Groceries'], interest: false},
  debt: {title: 'Debt', options: ['Student Loan', 'Credit Card'], interest: true}
};

// const {title, options, interest} = forms[formType];

function UserInfoForm (WrappedComponent, formType) {

  return class extends React.Component {
    render () {
      return (
        <WrappedComponent {...forms[formType]} {...this.props} />
      );
    }
  }
};

export default UserInfoForm;