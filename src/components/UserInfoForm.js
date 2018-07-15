import React from 'react';

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

const userInfoForm = (WrappedComponent, formType) => {

  const forms = {
    income: {title: '', options: '', interest: false},
    expense: {title: '', options: '', interest: false},
    debt: {title: '', options: '', interest: true}
  };

  const {title, options, interest} = forms[formType];

  class HOC extends React.Component {
    render () {
      return (
        <WrappedComponent title={title} options={options} interest={interest} {...this.props}/>
      );
    }
  }
  return HOC;
};

export default userInfoForm;