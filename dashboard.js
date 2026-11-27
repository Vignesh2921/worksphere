// I am checking if user is logged in, if not I am sending back to login
let loggedUser = localStorage.getItem("worksphere_user");
if(!loggedUser){
  window.location.href = "index.html";
} else {
  document.getElementById("userEmail").innerText = loggedUser;
}

function logout(){
  localStorage.removeItem("worksphere_user");
  window.location.href = "index.html";
}

function getEmployees(){
  let data = localStorage.getItem("worksphere_employees");
  return data ? JSON.parse(data) : [];
}

function saveEmployees(list){
  localStorage.setItem("worksphere_employees", JSON.stringify(list));
}

function showEmployees(){
  let list = getEmployees();
  let table = document.getElementById("empTable");
  let noEmp = document.getElementById("noEmp");
  document.getElementById("totalEmp").innerText = list.length;
  let depts = [...new Set(list.map(e => e.dept))];
  document.getElementById("totalDept").innerText = depts.length;

  if(list.length === 0){
    table.innerHTML = "";
    noEmp.style.display = "block";
  } else {
    noEmp.style.display = "none";
    table.innerHTML = list.map(e => `
    <tr>
      <td>${e.name}</td>
      <td>${e.email}</td>
      <td>${e.dept}</td>
      <td>Active</td>
      <td>
        <button class="btn-edit" onclick="editEmployee('${e.email}')">Edit</button>
        <button class="btn-del" onclick="deleteEmployee('${e.email}')">Delete</button>
      </td>
    </tr>
    `).join("");
  }
}

function addEmployee(){
  let name = document.getElementById("empName").value.trim();
  let email = document.getElementById("empEmail").value.trim();
  let dept = document.getElementById("empDept").value;
  let msg = document.getElementById("empMsg");
  if(!name || !email){
    msg.innerText = "Please enter Name and Email";
    return;
  }
  let list = getEmployees();
  let exists = list.find(e => e.email === email);
  if(exists){
    msg.innerText = "This email already exists!";
    return;
  }
  list.push({ name: name, email: email, dept: dept });
  saveEmployees(list);
  showEmployees();
  // I fixed here - after adding employee, I am reloading dropdown also, so new name shows in Select Employee
  loadAttDropdown();
  document.getElementById("empName").value = "";
  document.getElementById("empEmail").value = "";
  msg.style.color = "green";
  msg.innerText = "Employee Added Successfully!";
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}

function editEmployee(email){
  let list = getEmployees();
  let emp = list.find(e => e.email === email);
  if(!emp) return;
  document.getElementById("empName").value = emp.name;
  document.getElementById("empEmail").value = emp.email;
  document.getElementById("empDept").value = emp.dept;
  deleteEmployee(email, true);
  document.getElementById("empMsg").style.color = "blue";
  document.getElementById("empMsg").innerText = "Now edit and click Add Employee again to update!";
}

function deleteEmployee(email, isEdit = false){
  let list = getEmployees();
  let newList = list.filter(e => e.email !== email);
  saveEmployees(newList);
  showEmployees();
  // I fixed here - after deleting, dropdown also updates
  loadAttDropdown();
  if(!isEdit){
    let msg = document.getElementById("empMsg");
    msg.style.color = "red";
    msg.innerText = "Employee Deleted!";
    setTimeout(()=>{ msg.innerText = ""; }, 2000);
  }
}

function getToday(){
  return new Date().toISOString().split('T')[0];
}

function getAttendance(){
  let data = localStorage.getItem("worksphere_attendance");
  return data ? JSON.parse(data) : [];
}

function saveAttendance(list){
  localStorage.setItem("worksphere_attendance", JSON.stringify(list));
}

// I FIXED THIS FUNCTION - This is for Select Employee dropdown
// I am taking all employee names from list and putting them in dropdown
function loadAttDropdown(){
  let list = getEmployees();
  let select = document.getElementById("attEmp");
  if(!select) return;
  console.log("Dropdown loading, employees:", list);

  // If no employees, I am showing this message in dropdown
  if(list.length === 0){
    select.innerHTML = `<option value="">No Employee - First Add Employee</option>`;
    return;
  }

  // I am showing Name in dropdown, but I am saving Email inside, so I can find them easily
  select.innerHTML = `<option value="">Select Employee</option>` + list.map(e => `<option value="${e.email}">${e.name} - ${e.dept}</option>`).join("");
}

function markAttendance(){
  let email = document.getElementById("attEmp").value;
  let status = document.getElementById("attStatus").value;
  let msg = document.getElementById("attMsg");
  let today = getToday();
  if(!email){
    msg.innerText = "Please select employee";
    return;
  }
  let list = getEmployees();
  let emp = list.find(e => e.email === email);
  if(!emp){
    msg.innerText = "Employee not found, please add again";
    return;
  }
  let attList = getAttendance();
  let already = attList.find(a => a.email === email && a.date === today);
  if(already){
    already.status = status;
  } else {
    attList.push({ name: emp.name, email: email, status: status, date: today });
  }
  saveAttendance(attList);
  showAttendance();
  msg.style.color = "green";
  msg.innerText = "Attendance Marked!";
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}

function showAttendance(){
  let today = getToday();
  let attList = getAttendance().filter(a => a.date === today);
  let table = document.getElementById("attTable");
  let noAtt = document.getElementById("noAtt");
  if(!table) return;
  let presentCount = attList.filter(a => a.status === "Present").length;
  document.getElementById("presentToday").innerText = presentCount;
  if(attList.length === 0){
    table.innerHTML = "";
    if(noAtt) noAtt.style.display = "block";
    return;
  }
  if(noAtt) noAtt.style.display = "none";
  table.innerHTML = attList.map(a => `
    <tr>
      <td>${a.name}</td>
      <td><span class="${a.status === 'Present' ? 'badge-present' : 'badge-absent'}">${a.status}</span></td>
      <td>${a.date}</td>
    </tr>
  `).join("");
}

// I am calling all 3 when page opens, so everything shows
showEmployees();
loadAttDropdown();
showAttendance();