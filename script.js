'use strict';

///////////////////////////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Rajan GC',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-23T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-19T17:01:17.194Z",
    "2022-05-23T23:36:17.929Z",
    "2022-05-24T10:51:36.790Z",
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Simran Magar',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Nabin Pun',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-11-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-12-10T14:43:26.374Z",
    "2020-09-25T18:49:59.371Z",
    "2020-06-26T12:01:20.894Z",
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sandeep Pun Magar',
  movements: [430, 1000, 700, 50, 90],
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-01-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-05-25T14:18:46.235Z",
    "2020-12-05T16:33:06.386Z",
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
/////////////////////////////////////////////////////////////////////////////////


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const mainHidden= document.querySelector(".mainHidden")
mainHidden.classList.remove("mainHidden");
///////////////////////// Function ///////////////////////////////////

//Date seperate function
const dateFormate=function(date){
  const calDay= (todayDate,givenDate) => Math.trunc(Math.abs(todayDate-givenDate)/(1000*60*60*24));
  let dayPassed = calDay(new Date(),date);
  // console.log(dayPassed);
  if (dayPassed === 0) return "Today"
  if (dayPassed === 1) return "Yesterday"
  if (dayPassed <=7 ) return `${dayPassed} days ago`
  else{
    const year= `${date.getFullYear()}`.padStart(4,0);
    const month= `${date.getMonth()+1}`.padStart(2,0);
    const day= `${date.getDate()}`.padStart(2,0);
    return `${year}/${month}/${day}`
  }
}
//displaying money movements
const displayMovementBody = function (acc,sort = false) {
  containerMovements.innerHTML=""
  const movement= sort ? acc.movements.slice().sort((a,b)=> a-b) : acc.movements;
  movement.forEach(function (element,index) {
    const moneyTransaction = element > 0 ?"deposit" : "withdrawal"
    let date= new Date(acc.movementsDates[index])
    // console.log(date);
    let displayDate= dateFormate(date);
    // let displayDate= 
    const htmlBody= `
      <div class="movements__row">
          <div class="movements__type movements__type--${moneyTransaction}">${index+1} ${moneyTransaction}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">रु ${Math.abs(element)}</div>
      </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin',htmlBody)
  });
}

// displaying total balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `रु ${acc.balance}`;
};


let displayTotalAmount;
const displaySummary= function (values) {
// display deposit
  const summaryIn= values.movements.filter(value => value >= 0).reduce((acc,arr) => acc + arr,0);
  labelSumIn.textContent= `रु${summaryIn}`
//display withdrawl
  const summaryOut= values.movements.filter(value => value < 0).reduce((acc,arr) => acc + arr,0);
  labelSumOut.textContent= `रु${Math.abs(summaryOut)}`
// display interest
  const summaryInterest= Math.floor(values.movements.filter(value => value >= 0).map(value => (value*values.interestRate)/100).reduce((acc,arr) => acc + arr,0));
  labelSumInterest.textContent= `रु${summaryInterest}`
}


// creating username in account(object)
const firstName = function(array){
  array.forEach(function(element){
    element.username = element.owner.toLowerCase().split(' ').map(function(name){
      return name[0]
    }).join("")
  })
}
firstName(accounts)

const updateUI = function (acc) {
  // Display Movement Body 
  displayMovementBody(acc);
  // Display balance
  calcDisplayBalance(acc);
  //Display Summary
  displaySummary(acc);
};

//login section 
let currentAccount,timer;

const countTimeOut= function (){
  let logoutTime= 300;
  const tick= function(){
    let min = String(Math.trunc(logoutTime/60)).padStart(2,0);
    let sec = String(Math.trunc(logoutTime%60)).padStart(2,0);
    logoutTime--;
    labelTimer.textContent=`${min}:${sec}`
    if(logoutTime < 0) {
      clearInterval(timer);
      containerApp.style.opacity= 0;
      labelWelcome.textContent=`Log in to get started`
    }
  }
  tick();
  const timer= setInterval(tick, 1000);
  return timer;
};


/////////////////////////  Events ////////////////////////


//current date and time
const now = new Date();
const year= `${now.getFullYear()}`.padStart(4,0)
const month= `${now.getMonth()+1}`.padStart(2,0)
const day= `${now.getDate()}`.padStart(2,0)
const hour= `${now.getHours()}`.padStart(2,0)
const minute= `${now.getMinutes()}`.padStart(2,0)
labelDate.textContent= `${year}/${month}/${day},${hour}:${minute}`

btnLogin.addEventListener("click", function (e) {
  e.preventDefault()

  mainHidden.classList.add("mainHidden");

  currentAccount= accounts.find(account => account.username=== inputLoginUsername.value);
  // console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // console.log("Got logged in");
    containerApp.style.opacity= 100;
    inputLoginUsername.value=inputLoginPin.value='';
    inputLoginPin.blur();
    // Display user with welcome note
    labelWelcome.textContent=`Welcome, ${currentAccount.owner.split(" ")[0]}`
    // counting time for logout after certain time
    if(timer) clearInterval(timer);
    timer= countTimeOut();
    // Update UI
    updateUI(currentAccount);
  }
  else{
    labelWelcome.textContent=`Opps! Try again`
    containerApp.style.opacity= 0;
  }
})

////////////////////////// Transfer //////////////////////////////////
//transfer amount to certain account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Transer date too
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    //restore timer
    clearInterval(timer)
    timer= countTimeOut();
  }
});

////////////////////////// Loan //////////////////////////////////
// ask for loan if there is atleast 10% deposit(currentBalance) for loan amount
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount= Number(inputLoanAmount.value);
  // console.log(loanAmount);
  // console.log(currentAccount.balance);
  if(currentAccount.balance >= loanAmount* 0.1 && loanAmount > 0){
    setTimeout(function(){currentAccount.movements.push(loanAmount);
    //Transer loan date too
    currentAccount.movementsDates.push(new Date().toISOString());
    //update ui
    updateUI(currentAccount)
    //restore timer
    clearInterval(timer)
    timer= countTimeOut();
  },3000)
  }
  inputLoanAmount.value = "";
})


// close current account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if(inputCloseUsername.value== currentAccount.username && currentAccount.pin === Number(inputClosePin.value)){
    // console.log("Account is confirmed");
    const index= accounts.findIndex(acc => acc.username=== currentAccount.username)
    console.log(index);

    //delete account
    accounts.splice(index,1);
    containerApp.style.opacity= 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
})

//sort movements
let sortValue = false;
btnSort.addEventListener("click",function (e) {
  e.preventDefault();
  displayMovementBody(currentAccount,!sortValue);
  sortValue=!sortValue;
})

