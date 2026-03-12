let salary = 0
let expenses = []

const salaryDisplay = document.getElementById("salaryDisplay")
const expenseDisplay = document.getElementById("expenseDisplay")
const balanceDisplay = document.getElementById("balanceDisplay")
const expenseTable = document.getElementById("expenseTable")

// Load saved data
window.onload = function(){

const savedSalary = localStorage.getItem("salary")
const savedExpenses = localStorage.getItem("expenses")

if(savedSalary){
salary = Number(savedSalary)
}

if(savedExpenses){
expenses = JSON.parse(savedExpenses)
}

updateUI()

}

// Set salary
document.getElementById("setSalary").onclick = function(){

const salaryInput = Number(document.getElementById("salaryInput").value)

if(salaryInput <= 0){
alert("Please enter a valid salary")
return
}

salary = salaryInput

localStorage.setItem("salary",salary)

updateUI()

}

// Add expense
document.getElementById("addExpense").onclick = function(){

const nameInput = document.getElementById("expenseName")
const amountInput = document.getElementById("expenseAmount")

const name = nameInput.value.trim()
const amount = Number(amountInput.value)

const nameRegex = /^[A-Za-z ]+$/

if(name === "" || amount <= 0){
alert("Please enter valid expense details")
return
}

if(!nameRegex.test(name)){
alert("Expense name should contain letters only")
return
}

const expense = {
id: Date.now(),
name,
amount
}

expenses.push(expense)

localStorage.setItem("expenses",JSON.stringify(expenses))

// Clear inputs
nameInput.value = ""
amountInput.value = ""

updateUI()

}

// Delete expense
function deleteExpense(id){

expenses = expenses.filter(e => e.id !== id)

localStorage.setItem("expenses",JSON.stringify(expenses))

updateUI()

}

// Update UI
function updateUI(){

salaryDisplay.textContent = "₹" + salary

let totalExpense = 0

expenses.forEach(e => totalExpense += e.amount)

expenseDisplay.textContent = "₹" + totalExpense

const remaining = salary - totalExpense

balanceDisplay.textContent = "₹" + remaining

// Change color if balance negative
if(remaining < 0){
balanceDisplay.style.color = "red"
}else{
balanceDisplay.style.color = "green"
}

expenseTable.innerHTML = ""

expenses.forEach(exp =>{

const row = document.createElement("tr")

row.innerHTML = `
<td>${exp.name}</td>
<td>₹${exp.amount}</td>
<td><span class="delete" onclick="deleteExpense(${exp.id})">🗑</span></td>
`

expenseTable.appendChild(row)

})

updateChart(totalExpense)

}

// Chart.js
let chart

function updateChart(totalExpense){

const remaining = salary - totalExpense

const data = {

labels:["Expenses","Remaining"],

datasets:[{

data:[totalExpense,remaining],

backgroundColor:[
"#ef4444",
"#22c55e"
]

}]

}

if(chart){
chart.destroy()
}

chart = new Chart(document.getElementById("expenseChart"),{

type:"pie",
data:data,

options:{
responsive:true
}

})

}