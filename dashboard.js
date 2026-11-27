// ============================================================
// WORKSHPERE - DASHBOARD
// 1. Login check + Logout
// 2. Employee Add / Edit / Delete
// 3. Attendance - HR marks Present / Absent
// 4. Leave - HR applies, HR Approves / Rejects
// All data saved in localStorage
// ============================================================

// ---------- LOGIN CHECK ----------
// Only logged in HR can see Dashboard. If not logged in, go to login page.
let loggedUser = localStorage.getItem("worksphere_user");
if(!loggedUser){
  window.location.href = "index.html";
} else {
  document.getElementById("userEmail").innerText = loggedUser;
}

// ---------- LOGOUT ----------
// Clear login and go to login page
function logout(){
  localStorage.removeItem("worksphere_user");
  window.location.href = "index.html";
}

// ---------- EMPLOYEE GET / SAVE ----------
// localStorage only saves text, so we use JSON.stringify to save, JSON.parse to get
function getEmployees(){
  let data = localStorage.getItem("worksphere_employees");
  return data ? JSON.parse(data) : [];
}
function saveEmployees(list){
  localStorage.setItem("worksphere_employees", JSON.stringify(list));
}

// ---------- SHOW EMPLOYEES ----------
// Show employees in table + update Total Employees + Departments cards
function showEmployees(){
  let list = getEmployees();
  let table = document.getElementById("empTable");
  let noEmp = document.getElementById("noEmp");
  document.getElementById("totalEmp").innerText = list.length;
  // Set removes duplicate departments. Ex: IT, IT, HR -> IT, HR = 2
  let depts = [...new Set(list.map(e => e.dept))];
  document.getElementById("totalDept").innerText = depts.length;
  if(list.length === 0){
    table.innerHTML = "";
    noEmp.style.display = "block";
  } else {
    noEmp.style.display = "none";
    // Email is unique, so we use email to find employee for Edit/Delete
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

// ---------- ADD EMPLOYEE ----------
// Steps: Check empty -> Check duplicate email -> Add -> Save -> Refresh -> Clear form
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
  // After adding, refresh both dropdowns so new name shows in Attendance + Leave
  loadAttDropdown();
  loadLeaveDropdown();
  document.getElementById("empName").value = "";
  document.getElementById("empEmail").value = "";
  msg.style.color = "green";
  msg.innerText = "Employee Added Successfully!";
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}

// ---------- EDIT EMPLOYEE ----------
// LOGIC: Put old data in form, delete old record. When HR clicks Add again, new updated record saves.
// This trick avoids separate Update form.
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

// ---------- DELETE EMPLOYEE ----------
// filter keeps all except deleted one. isEdit=true means delete is from Edit, so no message.
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
// getToday gives date like 2026-11-27, so we can filter today's attendance only
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

// Fill Attendance dropdown with employee names. Value = email, Display = Name - Dept
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

// Mark Attendance: If already marked today, update it. If not, add new.
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

// Show today's attendance only + update Present Today card
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
// LOGIC: Leave has 3 statuses: Pending -> Approved / Rejected
// When HR applies leave, it starts as Pending. HR then clicks Approve / Reject.
// On Leave card shows: How many Approved leaves include Today. Ex: If Vignesh leave is 27th to 28th and today is 27th, he is On Leave.
// FUTURE: Employee will apply, HR will only Approve/Reject.

function getLeaves(){
  let data = localStorage.getItem("worksphere_leaves");
  return data ? JSON.parse(data) : [];
}
function saveLeaves(list){
  localStorage.setItem("worksphere_leaves", JSON.stringify(list));
}

// Fill Leave dropdown with employee names, same as attendance
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

// Apply Leave: HR selects employee, type, dates, reason. New leave is Pending.
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
  // To date should not be before From date
  if(to < from){
    msg.innerText = "To Date cannot be before From Date";
    return;
  }

  let list = getEmployees();
  let emp = list.find(e => e.email === email);
  if(!emp) return;

  let leaves = getLeaves();
  // Each leave gets a unique id using Date.now(), so we can Approve/Reject that one leave only
  leaves.push({ id: Date.now(), name: emp.name, email: email, type: type, from: from, to: to, reason: reason, status: "Pending" });
  saveLeaves(leaves);
  showLeaves();

  document.getElementById("leaveReason").value = "";
  msg.style.color = "green";
  msg.innerText = "Leave Applied - Waiting for Approval!";
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}

// Show all leaves + update On Leave card
function showLeaves(){
  let leaves = getLeaves();
  let table = document.getElementById("leaveTable");
  let noLeave = document.getElementById("noLeave");
  if(!table) return;

  // On Leave count: Approved leaves where today is between From and To
  let today = getToday();
  let onLeaveCount = leaves.filter(l => l.status === "Approved" && l.from <= today && l.to >= today).length;
  document.getElementById("onLeaveToday").innerText = onLeaveCount;

  if(leaves.length === 0){
    table.innerHTML = "";
    if(noLeave) noLeave.style.display = "block";
    return;
  }
  if(noLeave) noLeave.style.display = "none";

  // If status is Pending, show Approve + Reject buttons. If already decided, show no buttons.
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

// HR clicks Approve / Reject -> Update that leave's status using its id
function updateLeave(id, newStatus){
  let leaves = getLeaves();
  let leave = leaves.find(l => l.id === id);
  if(!leave) return;
  leave.status = newStatus;
  saveLeaves(leaves);
  showLeaves();
}

// ---------- WHEN PAGE OPENS ----------
// Load everything when page opens
showEmployees();
loadAttDropdown();
showAttendance();
loadLeaveDropdown();
showLeaves();