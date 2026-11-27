// I am managing employees here - Add, Edit, Delete, Search
import { supabase } from './api.js'
let user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('worksphere_user') || 'null')
if(typeof user === 'string'){ try{ user = JSON.parse(user) }catch(e){ user = { email: user } } }
if(!user || !user.email) location.href = 'index.html'
document.getElementById('userEmail').innerText = user.email
window.logout = function(){ localStorage.clear(); sessionStorage.clear(); location.href = 'index.html' }
let allEmps = []

// I am showing employees with search + filter
window.showEmployees = async function(){
  let res = await supabase.from('users').select('*').eq('role','Employee')
  allEmps = res.data || []
  let table = document.getElementById("empTable")
  let searchBox = document.getElementById("searchEmp")
  let searchText = ""
  if(searchBox){ searchText = searchBox.value.trim().toLowerCase() }
  let filterBox = document.getElementById("filterDept")
  let filterDept = "All"
  if(filterBox){ filterDept = filterBox.value }
  let list = []
  for(let i=0; i<allEmps.length; i++){
    let e = allEmps[i]
    let matchSearch = e.name.toLowerCase().includes(searchText) || e.email.toLowerCase().includes(searchText)
    // FIX 1: Dept null ayite IT ani pettanu, null kanipinchadhu
    let dept = e.dept || e.department || 'IT'
    let matchDept = (filterDept === "All" || dept === filterDept)
    if(matchSearch && matchDept){ list.push(e) }
  }
  if(allEmps.length === 0){ table.innerHTML=""; document.getElementById("noEmp").style.display="block"; return }
  if(list.length === 0){ table.innerHTML=""; document.getElementById("noEmp").style.display="none"; document.getElementById("noSearch").style.display="block"; return }
  document.getElementById("noEmp").style.display="none"; document.getElementById("noSearch").style.display="none"
  let html = ""
  for(let i=0; i<list.length; i++){
    let e = list[i]
    let dept = e.dept || e.department || 'IT'
    let salary = e.basic_salary || 30000
    html += '<tr><td>' + e.name + '</td><td>' + e.email + '</td><td>' + dept + '</td><td>Rs.' + salary + '</td><td><button class="btn-edit" onclick="editEmployee(\'' + e.email + '\')">Edit</button><button class="btn-del" onclick="deleteEmployee(\'' + e.email + '\')">Delete</button></td></tr>'
  }
  table.innerHTML = html
}

window.clearFilter = function(){ document.getElementById("searchEmp").value=""; document.getElementById("filterDept").value="All"; showEmployees() }

// I am adding a new employee to Supabase
window.addEmployee = async function(){
  let name = document.getElementById("empName").value.trim()
  let email = document.getElementById("empEmail").value.trim().toLowerCase()
  // FIX 2: Dept empty / null ayina kuda IT petti save chestha
  let dept = document.getElementById("empDept").value
  if(!dept){ dept = "IT" }
  let passBox = document.getElementById("empPass")
  let pass = "12345"
  if(passBox && passBox.value.trim() !== ""){ pass = passBox.value.trim() }
  let salaryBox = document.getElementById("empSalary")
  let salary = 30000
  if(salaryBox && salaryBox.value !== ""){ salary = Number(salaryBox.value) }
  let msg = document.getElementById("empMsg")
  if(!name || !email){ msg.innerText="Please enter Name and Email"; return }
  let res = await supabase.from('users').insert([{ name: name, email: email, password: pass, role: 'Employee', dept: dept, department: dept, basic_salary: salary }])
  if(res.error){ msg.innerText = res.error.message; return }
  document.getElementById("empName").value=""; document.getElementById("empEmail").value=""
  if(passBox){ passBox.value = "" }
  msg.style.color="green"; msg.innerText="Employee Added Successfully!"
  showEmployees()
}

// I am editing - I put old data in form and delete old record, then I add again
window.editEmployee = function(email){
  let emp = null
  for(let i=0; i<allEmps.length; i++){ if(allEmps[i].email === email){ emp = allEmps[i] } }
  if(!emp) return
  document.getElementById("empName").value = emp.name
  document.getElementById("empEmail").value = emp.email
  // FIX 3: Edit lo kuda null ayite IT petta
  document.getElementById("empDept").value = emp.dept || emp.department || 'IT'
  let salaryBox = document.getElementById("empSalary")
  if(salaryBox){ salaryBox.value = emp.basic_salary || 30000 }
  deleteEmployee(email, true)
  document.getElementById("empMsg").style.color="blue"; document.getElementById("empMsg").innerText="Now edit and click Add Employee again to update!"
}

// I am deleting employee by email
window.deleteEmployee = async function(email, isEdit){
  if(!isEdit){ isEdit = false }
  await supabase.from('users').delete().eq('email', email)
  showEmployees()
  if(!isEdit){ let m=document.getElementById("empMsg"); m.style.color="red"; m.innerText="Employee Deleted!" }
}
showEmployees()