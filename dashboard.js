// ============================================================
// WORKSHPERE - DASHBOARD
// 1. Login check + Logout
// 2. Employee Add / Edit / Delete + Search + Filter
// 3. Attendance - HR marks Present / Absent
// 4. Leave - HR applies, HR Approves / Rejects
// All data saved in localStorage
// ============================================================

// ---------- LOGIN CHECK ----------
let loggedUser = localStorage.getItem("worksphere_user");
if(!loggedUser){
  window.location.href = "index.html";
} else {
  document.getElementById("userEmail").innerText = loggedUser;
}

// ---------- LOGOUT ----------
function logout(){
  localStorage.removeItem("worksphere_user");
  window.location.href = "index.html";
}

// ---------- EMPLOYEE GET / SAVE ----------
function getEmployees(){
  let data = localStorage.getItem("worksphere_employees");
  return data ? JSON.parse(data) : [];
}
function saveEmployees(list){
  localStorage.setItem("worksphere_employees", JSON.stringify(list));
}

// ---------- SHOW EMPLOYEES + SEARCH + FILTER ----------
// LOGIC: We take full list, then filter it for DISPLAY only.
// Original list in localStorage is not changed by search.
// Steps:
// 1. Get full list
// 2. Read search text (lowercase, so "VIGNESH" and "vignesh" both match)
// 3. Read department filter (All = show all)
// 4. Filter: Name OR Email contains search text AND Dept matches filter
// 5. Show filtered list in table. Total cards still show full count, not filtered count.
function showEmployees(){
  let fullList = getEmployees();
  let table = document.getElementById("empTable");
  let noEmp = document.getElementById("noEmp");
  let noSearch = document.getElementById("noSearch");

  // Cards always show FULL count, not filtered count, because cards are for total company
  document.getElementById("totalEmp").innerText = fullList.length;
  let depts = [...new Set(fullList.map(e => e.dept))];
  document.getElementById("totalDept").innerText = depts.length;

  // Get search and filter values
  let searchText = document.getElementById("searchEmp") ? document.getElementById("searchEmp").value.trim().toLowerCase() : "";
  let filterDept = document.getElementById("filterDept") ? document.getElementById("filterDept").value : "All";

  // Filter logic
  let list = fullList.filter(e => {
    let matchSearch = e.name.toLowerCase().includes(searchText) || e.email.toLowerCase().includes(searchText);
    let matchDept = filterDept === "All" || e.dept === filterDept;
    return matchSearch && matchDept;
  });

  // If no employees at all in company
  if(fullList.length === 0){
    table.innerHTML = "";
    noEmp.style.display = "block";
    if(noSearch) noSearch.style.display = "none";
    return;
  }

  // If employees exist but search found nothing
  if(list.length === 0){
    table.innerHTML = "";
    noEmp.style.display = "none";
    if(noSearch) noSearch.style.display = "block";
    return;
  }

  // If found, show them
  noEmp.style.display = "none";
  if(noSearch) noSearch.style.display = "none";
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

// Clear Search + Filter, show all again
function clearFilter(){
  document.getElementById("searchEmp").value = "";
  document.getElementById("filterDept").value = "All";
  showEmployees();
}

// ---------- ADD EMPLOYEE ----------
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
  loadAttDropdown();
  loadLeaveDropdown();
  document.getElementById("empName").value = "";
  document.getElementById("empEmail").value = "";
  msg.style.color = "green";
  msg.innerText = "Employee Added Successfully!";
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}

// ---------- EDIT ----------
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

// ---------- DELETE ----------
function deleteEmployee(email, isEdit = false){
  let list = getEmployees();
  let newList = list.filter(e => e.email !== email);
  saveEmployees(newList);
  showEmployees();
  loadAttDropdown();
  loadLeaveDropdown();
  if(!isEdit){
    let msg = document.getElementById("empMsg");
    msg.style.color = "red";
    msg.innerText = "Employee Deleted!";
    setTimeout(()=>{ msg.innerText = ""; }, 2000);
  }
}

// ---------- ATTENDANCE ----------
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
function loadAttDropdown(){
  let list = getEmployees();
  let select = document.getElementById("attEmp");
  if(!select) return;
  if(list.length === 0){
    select.innerHTML = `<option value="">No Employee - First Add Employee</option>`;
    return;
  }
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
  if(!emp) return;
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

// ---------- LEAVE ----------
// Leave Status: Pending -> Approved / Rejected. On Leave card = Approved leaves that include Today.
function getLeaves(){
  let data = localStorage.getItem("worksphere_leaves");
  return data ? JSON.parse(data) : [];
}
function saveLeaves(list){
  localStorage.setItem("worksphere_leaves", JSON.stringify(list));
}
function loadLeaveDropdown(){
  let list = getEmployees();
  let select = document.getElementById("leaveEmp");
  if(!select) return;
  if(list.length === 0){
    select.innerHTML = `<option value="">No Employee - First Add Employee</option>`;
    return;
  }
  select.innerHTML = `<option value="">Select Employee</option>` + list.map(e => `<option value="${e.email}">${e.name} - ${e.dept}</option>`).join("");
}
function applyLeave(){
  let email = document.getElementById("leaveEmp").value;
  let type = document.getElementById("leaveType").value;
  let from = document.getElementById("leaveFrom").value;
  let to = document.getElementById("leaveTo").value;
  let reason = document.getElementById("leaveReason").value.trim();
  let msg = document.getElementById("leaveMsg");
  if(!email || !from || !to || !reason){
    msg.innerText = "Please fill all leave details";
    return;
  }
  if(to < from){
    msg.innerText = "To Date cannot be before From Date";
    return;
  }
  let list = getEmployees();
  let emp = list.find(e => e.email === email);
  if(!emp) return;
  let leaves = getLeaves();
  leaves.push({ id: Date.now(), name: emp.name, email: email, type: type, from: from, to: to, reason: reason, status: "Pending" });
  saveLeaves(leaves);
  showLeaves();
  document.getElementById("leaveReason").value = "";
  msg.style.color = "green";
  msg.innerText = "Leave Applied - Waiting for Approval!";
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}
function showLeaves(){
  let leaves = getLeaves();
  let table = document.getElementById("leaveTable");
  let noLeave = document.getElementById("noLeave");
  if(!table) return;
  let today = getToday();
  let onLeaveCount = leaves.filter(l => l.status === "Approved" && l.from <= today && l.to >= today).length;
  document.getElementById("onLeaveToday").innerText = onLeaveCount;
  if(leaves.length === 0){
    table.innerHTML = "";
    if(noLeave) noLeave.style.display = "block";
    return;
  }
  if(noLeave) noLeave.style.display = "none";
  table.innerHTML = leaves.map(l => `
    <tr>
      <td>${l.name}</td>
      <td>${l.type}</td>
      <td>${l.from}</td>
      <td>${l.to}</td>
      <td>${l.reason}</td>
      <td><span class="${l.status === 'Approved' ? 'badge-present' : l.status === 'Rejected' ? 'badge-absent' : 'badge-pending'}">${l.status}</span></td>
      <td>
        ${l.status === 'Pending' ? `<button class="btn-approve" onclick="updateLeave(${l.id}, 'Approved')">Approve</button> <button class="btn-reject" onclick="updateLeave(${l.id}, 'Rejected')">Reject</button>` : '-'}
      </td>
    </tr>
  `).join("");
}
function updateLeave(id, newStatus){
  let leaves = getLeaves();
  let leave = leaves.find(l => l.id === id);
  if(!leave) return;
  leave.status = newStatus;
  saveLeaves(leaves);
  showLeaves();
}

// ---------- WHEN PAGE OPENS ----------
showEmployees();
loadAttDropdown();
showAttendance();
loadLeaveDropdown();
showLeaves();