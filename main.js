const form = document.querySelector('.calc');
const dados = {}
const taxas = document.querySelectorAll('.taxa');
const tipAmount = document.getElementById('personAmount');
const totalAmount = document.getElementById('totalPerson');
const customPer = document.getElementById('customper');
const numberPeople = document.getElementById('numPeople');
const reset = document.getElementById('reset');
const errorMessage = document.querySelector('.errorMessage');

//default values
dados.fee = 0;
dados.numPeople = 1;
dados.billAmount = 0;

form.addEventListener('change', handleChange);

taxas.forEach((item) => {
  item.addEventListener('click', chooseFee);
})

customPer.addEventListener('change', handleCustomPer);

reset.addEventListener('click', resetCalc);

function handleCustomPer() {
  dados.fee = +this.value;
  this.classList.add('active');

  //unselect others fee buttons
  taxas.forEach(item => item.classList.remove('active'));
}

function handleChange(event) {
  if(event.target.name === 'numPeople' && !event.target.checkValidity()) {
    errorMessage.style.display = "block";
    numberPeople.classList.add('error');
  }
  //if number people is still 0
  else if(numberPeople.value == 0) {
    if(event.target.name) 
      dados[event.target.name] = +event.target.value;
    
    else
      null
  }
  //don't calculate in case of people = 0, because of math problems
  else {
    //in case numberPeople was 0 in last input and is no more
    numberPeople.classList.remove('error');
    errorMessage.style.display = "none";

    //if it's an user event, then save its value
    if(event.target.name) {
      dados[event.target.name] = +event.target.value;
    }
    console.log(dados);
  
    const showTip = tipPerPerson(dados.billAmount, dados.fee, dados.numPeople);
    tipAmount.innerText = '$' + showTip;
  
    const showTotal = totalPerPerson();
    totalAmount.innerText = '$' + showTotal;
  
    reset.classList.add('active');
  }
}

function chooseFee() {
  //if last selected was the same button, unselect it
  if(+this.dataset.fee === dados.fee) {
    this.classList.remove('active');
    dados.fee = 0;
    form.dispatchEvent(new Event('change'));
  }

  else {
    //unselect other button
    taxas.forEach(item => item.classList.remove('active'));

    //unselect custom percentage if it was selected
    customPer.classList.remove('active');
    customPer.value = '';

    this.classList.add('active');
    let taxa = +this.getAttribute('data-fee');
    dados.fee = taxa;

    //simulate a change event on form, to make it auto update and do the math
    form.dispatchEvent(new Event('change'));
  }
}

function tipPerPerson() {
  let totalTip = dados.billAmount * (dados.fee / 100);
  let tipPerPerson = (totalTip / dados.numPeople).toFixed(2);
  dados.tipPerPerson = +tipPerPerson;
  return tipPerPerson;
}

function totalPerPerson() {
  let total = dados.billAmount * (1 + (dados.fee / 100));
  let totalPerson = (total / dados.numPeople).toFixed(2);
  return (totalPerson);
}

function resetCalc() {
  //all input values go back to as it was on start
  form.elements.billAmount.value = '';
  form.elements.numPeople.value = 1;
  form.elements.customper.value = '';

  const entries = Object.keys(dados);
  entries.forEach((item) => {
    item !== 'numPeople' ? dados[item] = 0 : dados[item] = 1;
  })

  form.dispatchEvent(new Event('change'));
  this.classList.remove('active');
  errorMessage.style.display = 'none';
  taxas.forEach(item => item.classList.remove('active'));

  //go to top of the page, especially on mobile
  window.scrollTo({top: 0, behavior: 'smooth'});
}


