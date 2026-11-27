// ============================================================
// attendance.js - ONLY ATTENDANCE PAGE
// LOGIC: Ippudu HR Admin Model - HR andhari attendance vesthadu.
// STEP 8 lo: Employee Self Model - Employee thana attendance thane vesthadu.
// ============================================================

// DROPDOWN - Employees list nunchi dropdown fill chestham
// Value = email (unique), Display = Name - Dept
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
  
  // MARK ATTENDANCE
  // Steps: Employee select chesada? -> Already marked today? -> Yes ayithe Update, No ayithe New Add
  // Oke roju oke employee ki 2 records undakudadhu, andhuke Update logic pettam
  function markAttendance(){
    let email = document.getElementById("attEmp").value;
    let status = document.getElementById("attStatus").value;
    let msg = document.getElementById("attMsg");
    let today = getToday();
    if(!email){
      msg.innerText = "Please select employee";
      return;
    }
    let emp = getEmployees().find(e => e.email === email);
    if(!emp) return;
    let attList = getAttendance();
    let already = attList.find(a => a.email === email && a.date === today);
    if(already){
      already.status = status; // HR manasu marchukunte update
    } else {
      // SQL lo: INSERT INTO attendance (name, email, status, date) VALUES (...)
      attList.push({ name: emp.name, email: email, status: status, date: today });
    }
    saveAttendance(attList);
    showAttendance();
    msg.style.color = "green";
    msg.innerText = "Attendance Marked!";
    setTimeout(()=>{ msg.innerText = ""; }, 2000);
  }
  
  // SHOW TODAY'S ATTENDANCE ONLY
  function showAttendance(){
    let today = getToday();
    // Old days vi chupincham, kevalam today vi matrame
    let attList = getAttendance().filter(a => a.date === today);
    let table = document.getElementById("attTable");
    let noAtt = document.getElementById("noAtt");
    if(!table) return;
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
  
  // PAGE OPEN AYINAPPUDU
  loadAttDropdown();
  showAttendance();