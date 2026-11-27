// ============================================================
// employees.js - ONLY EMPLOYEES PAGE
// Panulu: Add / Edit / Delete / Search / Filter
// ============================================================

// SHOW EMPLOYEES + SEARCH + FILTER
// LOGIC: Full list teesukuni, search + filter tho display kosam filter chestham.
// Original data maradhu, kevalam chupinchedhi maruthundi.
function showEmployees(){
    let fullList = getEmployees();
    let table = document.getElementById("empTable");
    let noEmp = document.getElementById("noEmp");
    let noSearch = document.getElementById("noSearch");
    if(!table) return;
  
    // Search text - lowercase lo convert chestham, so VIGNESH / vignesh rendu match avuthay
    let searchText = document.getElementById("searchEmp") ? document.getElementById("searchEmp").value.trim().toLowerCase() : "";
    let filterDept = document.getElementById("filterDept") ? document.getElementById("filterDept").value : "All";
  
    // Filter: Name lo OR Email lo search text undali, AND Dept match avvali
    let list = fullList.filter(e => {
      let matchSearch = e.name.toLowerCase().includes(searchText) || e.email.toLowerCase().includes(searchText);
      let matchDept = filterDept === "All" || e.dept === filterDept;
      return matchSearch && matchDept;
    });
  
    // Company lo evaru leru
    if(fullList.length === 0){
      table.innerHTML = "";
      noEmp.style.display = "block";
      if(noSearch) noSearch.style.display = "none";
      return;
    }
    // Unnaru kani search ki dorakaledu
    if(list.length === 0){
      table.innerHTML = "";
      noEmp.style.display = "none";
      if(noSearch) noSearch.style.display = "block";
      return;
    }
  
    noEmp.style.display = "none";
    if(noSearch) noSearch.style.display = "none";
    // Email unique, andhuke Edit/Delete ki email vaduthunnam
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
  
  // CLEAR FILTER - Search + Filter clear chesi andharini chupisthundi
  function clearFilter(){
    document.getElementById("searchEmp").value = "";
    document.getElementById("filterDept").value = "All";
    showEmployees();
  }
  
  // ADD EMPLOYEE
  // Steps: Empty check -> Duplicate email check -> Add -> Save -> Clear form
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
    // SQL lo: INSERT INTO employees (name, email, dept) VALUES (...)
    list.push({ name: name, email: email, dept: dept });
    saveEmployees(list);
    showEmployees();
    document.getElementById("empName").value = "";
    document.getElementById("empEmail").value = "";
    msg.style.color = "green";
    msg.innerText = "Employee Added Successfully!";
    setTimeout(()=>{ msg.innerText = ""; }, 2000);
  }
  
  // EDIT EMPLOYEE
  // LOGIC: Old data ni form lo petti, old record delete chestham.
  // HR Edit chesi Add nokkithe kotha updated record save avuthundi.
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
  
  // DELETE EMPLOYEE
  // filter tho aa okkarini teesesi migilinavallani save chestham
  // isEdit=true ante Edit nunchi vachindhi, andhuke Deleted message chupincham
  function deleteEmployee(email, isEdit = false){
    let list = getEmployees();
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
  
  // PAGE OPEN AYINAPPUDU - List chupinchu
  showEmployees();