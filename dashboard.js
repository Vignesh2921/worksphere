// I am checking if user is logged in, if not I am sending back to login
let loggedUser = localStorage.getItem("worksphere_user");
if(!loggedUser){
  window.location.href = "index.html";
} else {
  // I am showing logged in email in sidebar
  document.getElementById("userEmail").innerText = loggedUser;
}

// I added logout, it clears user and goes to login page
function logout(){
  localStorage.removeItem("worksphere_user");
  window.location.href = "index.html";
}

// I am getting employees from localStorage, if no data I am taking empty list
function getEmployees(){
  let data = localStorage.getItem("worksphere_employees");
  return data ? JSON.parse(data) : [];
}

// I am saving employees list to localStorage
function saveEmployees(list){
  localStorage.setItem("worksphere_employees", JSON.stringify(list));
}

// I added this to show employees in table
function showEmployees(){
  let list = getEmployees();
  let table = document.getElementById("empTable");
  let noEmp = document.getElementById("noEmp");

  // I am updating total count in card
  document.getElementById("totalEmp").innerText = list.length;

  // I am counting departments, so I can show in card
  let depts = [...new Set(list.map(e => e.dept))];
  document.getElementById("totalDept").innerText = depts.length;

  if(list.length === 0){
    table.innerHTML = "";
    noEmp.style.display = "block";
    return;
  }

  noEmp.style.display = "none";
  // I added edit and delete buttons for each employee, I am using email to find them
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

// I am handling add employee here
function addEmployee(){
  let name = document.getElementById("empName").value.trim();
  let email = document.getElementById("empEmail").value.trim();
  let dept = document.getElementById("empDept").value;
  let msg = document.getElementById("empMsg");

  // I am checking if fields are empty
  if(!name || !email){
    msg.innerText = "Please enter Name and Email";
    return;
  }

  let list = getEmployees();

  // I am checking if email already exists, I don't want duplicate
  let exists = list.find(e => e.email === email);
  if(exists){
    msg.innerText = "This email already exists!";
    return;
  }

  // I am adding new employee to list
  list.push({ name: name, email: email, dept: dept });
  saveEmployees(list);
  showEmployees();

  // I am clearing form after adding, so HR can add next one
  document.getElementById("empName").value = "";
  document.getElementById("empEmail").value = "";
  msg.style.color = "green";
  msg.innerText = "Employee Added Successfully!";
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}

// I am handling edit here - when HR clicks edit, I am putting data back into form
function editEmployee(email){
  let list = getEmployees();
  let emp = list.find(e => e.email === email);
  if(!emp) return;

  // I am filling form with old data, so HR can change it
  document.getElementById("empName").value = emp.name;
  document.getElementById("empEmail").value = emp.email;
  document.getElementById("empDept").value = emp.dept;

  // I am deleting old one, because when HR clicks Add again, new one will save
  // I am doing this trick so I don't need a separate update form
  deleteEmployee(email, true);

  document.getElementById("empMsg").style.color = "blue";
  document.getElementById("empMsg").innerText = "Now edit and click Add Employee again to update!";
}

// I am handling delete here
function deleteEmployee(email, isEdit = false){
  let list = getEmployees();
  // I am removing that one employee, others I am keeping
  let newList = list.filter(e => e.email !== email);
  saveEmployees(newList);
  showEmployees();

  if(!isEdit){
    let msg = document.getElementById("empMsg");
    msg.style.color = "red";
    msg.innerText = "Employee Deleted!";
    setTimeout(()=>{ msg.innerText = ""; }, 2000);
  }
}

// I am showing list when page opens
showEmployees();