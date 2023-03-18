"use strict";
// Data
const account1 = {
  owner: "Mohd Saifulla",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Mohd Asif",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Krishnkant Rajpoot",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Devyank Dubey",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// movements
const displayMovements = function (movements, sort = true) {
  const movSort = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = "";
  movSort.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} Rs</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// showing total ammount on right top corner
const calcDisplayBalance = function (accs) {
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${accs.balance} Rs`;
};

// showing summary of total deposite withdrawl and intrest  below
const calcDisplaySummary = function (acc) {
  //in
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, inc) => acc + inc, 0);
  labelSumIn.textContent = `${income} Rs`;
  // out
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, out) => acc + out, 0);
  labelSumOut.textContent = `${Math.abs(out)} Rs`;
  //intrest ,you will get intrest on each deposite of 1.2% if intrest is comulative greator than 1
  const intrest = acc.movements
    .filter((mov) => mov > 0)
    .map((int) => int * (acc.interestRate / 100))
    .filter((intr) => intr > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${intrest} Rs`;
};
// creating a userName to fill the user name in login credential
const createUserName = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);
const updateUi = function () {
  displayMovements(currentAccount.movements);

  //display overal ballance
  calcDisplayBalance(currentAccount);

  //display summary below
  calcDisplaySummary(currentAccount);
};
// matching user name and password and show that user data
let currentAccount, timer; //outside bcz we will use this in future
btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); //need to prevent bcz form was autosubmiting and reloading
  currentAccount = accounts.find(
    (accs) => accs.username === inputLoginUsername.value
  );
  // console.log('login')//?optional chaining if exist then show
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //write greet on top left corner
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[1]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //display all moments called balence
    updateUi(currentAccount);
    // displayMovements(currentAccount.movements);

    // //display overal ballance
    // calcDisplayBalance(currentAccount);

    // //display summary below
    // calcDisplaySummary(currentAccount);
  } else {
    alert(
      "🔴 Trying to Hack the account 👨‍💻 let me help 😂 you can enter any of these user name and password---> ms,1111 or ma,2222 or kr,3333 or dd,4444 all should be in small letter 🙌"
    );
  }
  if (timer) clearInterval(timer);
  timer = setLogoutTimer();
});
// transfer money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }
  updateUi(currentAccount);
  clearInterval(timer);
  timer = setLogoutTimer();
});

// demand for loan //only if ammount is min 10% of the loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const ammount = Number(inputLoanAmount.value);
  if (
    ammount > 0 &&
    currentAccount.movements.some((mov) => mov >= ammount * 0.1)
  ) {
    currentAccount.movements.push(ammount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
  clearInterval(timer);
  timer = setLogoutTimer();
});
// delete account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  } else {
    alert("Please enter correct user name and password");
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

// sorting movemenst
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// date
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minute = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

// setttng time interval for logout

const setLogoutTimer = function () {
  let time = 600;
  let timer = setInterval(() => {
    let min = String(`${Math.trunc(time / 60)}`.padStart(2, 0));
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  }, 1000);
  return timer;
};
