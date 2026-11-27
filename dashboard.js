// ============================================================
// WORKSHPERE - DASHBOARD LOGIC
// ============================================================
// WHAT IS THIS FILE?
// This file controls Dashboard page.
// It does 3 main works:
// 1. Login check + Logout
// 2. Employee Add / Edit / Delete / Show
// 3. Attendance Mark / Show
// All data is saved in Browser localStorage, so even after refresh data will stay.
// ============================================================

// ------------------------------------------------------------
// PART 1: LOGIN CHECK
// ------------------------------------------------------------
// LOGIC: Only logged in HR can see Dashboard.
// If user is not logged in, we send him back to login page (index.html)
// How we know if logged in? We check localStorage key "worksphere_user"
// If that key is empty, it means not logged in.
// ------------------------------------------------------------
let loggedUser = localStorage.getItem("worksphere_user");
if(!loggedUser){
  // Not logged in, so go to login page
  window.location.href = "index.html";
} else {
  // Logged in, so I am showing logged in email in sidebar
  document.getElementById("userEmail").innerText = loggedUser;
}

// ------------------------------------------------------------
// PART 2: LOGOUT
// ------------------------------------------------------------
// LOGIC: When HR clicks Logout, we clear login data and go to login page
// ------------------------------------------------------------
function logout(){
  localStorage.removeItem("worksphere_user");
  window.location.href = "index.html";
}

// ------------------------------------------------------------
// PART 3: EMPLOYEE - GET AND SAVE
// ------------------------------------------------------------
// We are saving employees in localStorage with key "worksphere_employees"
// localStorage can only save text, so we convert list to JSON string when saving,
// and convert back to list when getting.
// ------------------------------------------------------------

// I am getting employees from localStorage
// If no data, I am returning empty list [], so code will not break
function getEmployees(){
  let data = localStorage.getItem("worksphere_employees");
  return data ? JSON.parse(data) : [];
}

// I am saving employees list to localStorage
function saveEmployees(list){
  localStorage.setItem("worksphere_employees", JSON.stringify(list));
}

// ------------------------------------------------------------
// PART 4: SHOW EMPLOYEES IN TABLE
// ------------------------------------------------------------
// LOGIC: Take employees list, show them in table one by one.
// Also update top cards: Total Employees and Total Departments
// ------------------------------------------------------------
function showEmployees(){
  let list = getEmployees(); // Get all employees
  let table = document.getElementById("empTable"); // Table body where list will show
  let noEmp = document.getElementById("noEmp"); // "No employees" message

  // I am updating Total Employees card
  document.getElementById("totalEmp").innerText = list.length;

  // I am counting departments
  // Example: If list has IT, IT, HR -> Set will make it [IT, HR] -> length 2
  // So I can show "2 Departments" in card
  let depts = [...new Set(list.map(e => e.dept))];
  document.getElementById("totalDept").innerText = depts.length;

  // If no employees, show "No employees" message and clear table
  if(list.length === 0){
    table.innerHTML = "";
    noEmp.style.display = "block";
  } else {
    // If employees exist, hide "No employees" message
    noEmp.style.display = "none";
    // I am creating one <tr> row for each employee
    // I am using email to identify employee for Edit / Delete, because email is unique
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

// ------------------------------------------------------------
// PART 5: ADD EMPLOYEE
// ------------------------------------------------------------
// LOGIC: HR enters Name, Email, Dept and clicks Add.
// Steps:
// 1. Check if Name / Email empty -> Show error
// 2. Check if Email already exists -> Show error, because duplicate not allowed
// 3. If ok, add new employee to list and save
// 4. Clear form and show success message
// ------------------------------------------------------------
function addEmployee(){
  // I am taking values from input boxes and removing extra spaces with trim()
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

  // I am checking if email already exists, I don't want duplicate employee
  let exists = list.find(e => e.email === email);
  if(exists){
    msg.innerText = "This email already exists!";
    return;
  }

  // I am adding new employee to list
  list.push({ name: name, email: email, dept: dept });
  saveEmployees(list); // Save to localStorage
  showEmployees(); // Refresh table

  // After adding employee, I am reloading attendance dropdown also, so new name shows there
  loadAttDropdown();

  // I am clearing form after adding, so HR can add next one easily
  document.getElementById("empName").value = "";
  document.getElementById("empEmail").value = "";
  msg.style.color = "green";
  msg.innerText = "Employee Added Successfully!";
  // After 2 seconds, I am clearing message
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}

// ------------------------------------------------------------
// PART 6: EDIT EMPLOYEE
// ------------------------------------------------------------
// LOGIC: When HR clicks Edit, I am putting old data back into form.
// Then I am deleting old record.
// When HR clicks "Add Employee" again, new updated record will save.
// This trick is used so we don't need a separate Update form.
// ------------------------------------------------------------
function editEmployee(email){
  let list = getEmployees();
  // I am finding employee using email
  let emp = list.find(e => e.email === email);
  if(!emp) return; // If not found, do nothing

  // I am filling form with old data, so HR can change it
  document.getElementById("empName").value = emp.name;
  document.getElementById("empEmail").value = emp.email;
  document.getElementById("empDept").value = emp.dept;

  // I am deleting old one, because when HR clicks Add again, new one will save
  // true means "this delete is for Edit, not real delete", so no delete message will show
  deleteEmployee(email, true);

  document.getElementById("empMsg").style.color = "blue";
  document.getElementById("empMsg").innerText = "Now edit and click Add Employee again to update!";
}

// ------------------------------------------------------------
// PART 7: DELETE EMPLOYEE
// ------------------------------------------------------------
// LOGIC: Remove that one employee from list, keep others.
// isEdit = true means this delete is called from Edit function, so don't show "Deleted" message.
// isEdit = false means HR really clicked Delete button, so show message.
// ------------------------------------------------------------
function deleteEmployee(email, isEdit = false){
  let list = getEmployees();
  // I am removing that one employee, others I am keeping
  // filter() will keep all employees whose email is NOT equal to deleted email
  let newList = list.filter(e => e.email !== email);
  saveEmployees(newList);
  showEmployees();

  // After deleting, dropdown also updates, so deleted name goes away from attendance dropdown
  loadAttDropdown();

  if(!isEdit){
    let msg = document.getElementById("empMsg");
    msg.style.color = "red";
    msg.innerText = "Employee Deleted!";
    setTimeout(()=>{ msg.innerText = ""; }, 2000);
  }
}

// ------------------------------------------------------------
// PART 8: ATTENDANCE - GET TODAY'S DATE
// ------------------------------------------------------------
// LOGIC: We need today's date to filter today's attendance only.
// Example: If today is 2026-11-27, we only show attendance of that date.
// We use toISOString() which gives "2026-11-27T..." and we split to take only date part.
// ------------------------------------------------------------
function getToday(){
  return new Date().toISOString().split('T')[0];
}

// ------------------------------------------------------------
// PART 9: ATTENDANCE - GET AND SAVE
// ------------------------------------------------------------
// We save attendance in localStorage with key "worksphere_attendance"
// Each attendance record has: name, email, status (Present/Absent), date
// ------------------------------------------------------------
function getAttendance(){
  let data = localStorage.getItem("worksphere_attendance");
  return data ? JSON.parse(data) : [];
}

function saveAttendance(list){
  localStorage.setItem("worksphere_attendance", JSON.stringify(list));
}

// ------------------------------------------------------------
// PART 10: ATTENDANCE DROPDOWN
// ------------------------------------------------------------
// LOGIC: HR Admin Model - HR will select employee name from dropdown.
// This dropdown is filled automatically from Employees List.
// So HR does not need to type name, he just selects.
// If no employees, dropdown will show "No Employee - First Add Employee"
// FUTURE CHANGE: In Employee Self Model, employee will not see dropdown,
// he will only see his own name, because he can only mark his own attendance.
// ------------------------------------------------------------
function loadAttDropdown(){
  let list = getEmployees(); // Get all employees
  let select = document.getElementById("attEmp"); // Dropdown element
  if(!select) return;

  // If no employees, show message in dropdown
  if(list.length === 0){
    select.innerHTML = `<option value="">No Employee - First Add Employee</option>`;
    return;
  }

  // I am showing Name + Department in dropdown for easy identification
  // But value is Email, because Email is unique and we use it to find employee
  // Example: Dropdown shows "Vignesh - IT" but inside value is "vignesh@worksphere.com"
  select.innerHTML = `<option value="">Select Employee</option>` + list.map(e => `<option value="${e.email}">${e.name} - ${e.dept}</option>`).join("");
}

// ------------------------------------------------------------
// PART 11: MARK ATTENDANCE
// ------------------------------------------------------------
// LOGIC: HR selects Employee + Present/Absent and clicks Mark.
// Steps:
// 1. Check if employee selected, if not show error
// 2. Check if already marked today -> If yes, update status (HR changed mind)
// 3. If not marked, add new record
// 4. Save and refresh attendance table
// ------------------------------------------------------------
function markAttendance(){
  let email = document.getElementById("attEmp").value; // Selected employee email
  let status = document.getElementById("attStatus").value; // Present or Absent
  let msg = document.getElementById("attMsg");
  let today = getToday();

  // If HR did not select employee, show error
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

  // I am checking if already marked today, I don't want duplicate for same day
  // Example: If Vignesh already marked Present today, and HR again marks Absent, we update same record, not add new one
  let already = attList.find(a => a.email === email && a.date === today);
  if(already){
    already.status = status; // I am updating if HR changes mind
  } else {
    // If not marked yet, I am adding new attendance record
    attList.push({ name: emp.name, email: email, status: status, date: today });
  }

  saveAttendance(attList);
  showAttendance(); // Refresh table
  msg.style.color = "green";
  msg.innerText = "Attendance Marked!";
  setTimeout(()=>{ msg.innerText = ""; }, 2000);
}

// ------------------------------------------------------------
// PART 12: SHOW TODAY'S ATTENDANCE
// ------------------------------------------------------------
// LOGIC: Show only today's attendance in table.
// Also update "Present Today" card in top.
// Present count = How many have status = Present today
// ------------------------------------------------------------
function showAttendance(){
  let today = getToday();
  // I am filtering only today's records, old days records are hidden
  let attList = getAttendance().filter(a => a.date === today);
  let table = document.getElementById("attTable");
  let noAtt = document.getElementById("noAtt");
  if(!table) return;

  // I am updating Present Today card in dashboard
  let presentCount = attList.filter(a => a.status === "Present").length;
  document.getElementById("presentToday").innerText = presentCount;

  // If no attendance today, show "No attendance" message
  if(attList.length === 0){
    table.innerHTML = "";
    if(noAtt) noAtt.style.display = "block";
    return;
  }

  if(noAtt) noAtt.style.display = "none";
  // I am showing each attendance record in table with green badge for Present, red badge for Absent
  table.innerHTML = attList.map(a => `
    <tr>
      <td>${a.name}</td>
      <td><span class="${a.status === 'Present' ? 'badge-present' : 'badge-absent'}">${a.status}</span></td>
      <td>${a.date}</td>
    </tr>
  `).join("");
}

// ------------------------------------------------------------
// PART 13: WHEN PAGE OPENS
// ------------------------------------------------------------
// I am calling all 3 functions when page opens, so everything shows without clicking anything
// ------------------------------------------------------------
showEmployees();
loadAttDropdown();
showAttendance();