// ============================================================
// leave.js - ONLY LEAVE PAGE
// LOGIC: Leave Status - Pending -> Approved / Rejected
// Ippudu HR ye apply chesthadu, HR ye Approve chesthadu.
// STEP 8 lo: Employee apply chesthadu, HR kevalam Approve/Reject chesthadu.
// Request Flow: Employee rasindhi oke Database lo save avuthundi, HR ade Database chusthadu.
// Andhuke mail avasaram ledu.
// ============================================================

// DROPDOWN - Employees list nunchi fill
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
  
  // APPLY LEAVE - New leave Pending ga save avuthundi
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
    let emp = getEmployees().find(e => e.email === email);
    if(!emp) return;
  
    let leaves = getLeaves();
    // Prathi leave ki unique id - Date.now() - Approve/Reject cheyadaniki aa id ye vadutham
    // SQL lo: INSERT INTO leaves (...) VALUES (...)
    leaves.push({ id: Date.now(), name: emp.name, email: email, type: type, from: from, to: to, reason: reason, status: "Pending" });
    saveLeaves(leaves);
    showLeaves();
    document.getElementById("leaveReason").value = "";
    msg.style.color = "green";
    msg.innerText = "Leave Applied - Waiting for Approval!";
    setTimeout(()=>{ msg.innerText = ""; }, 2000);
  }
  
  // SHOW ALL LEAVES
  function showLeaves(){
    let leaves = getLeaves();
    let table = document.getElementById("leaveTable");
    let noLeave = document.getElementById("noLeave");
    if(!table) return;
    if(leaves.length === 0){
      table.innerHTML = "";
      if(noLeave) noLeave.style.display = "block";
      return;
    }
    if(noLeave) noLeave.style.display = "none";
    // Pending ayithe ne Approve/Reject buttons. Already decided ayithe '-' chupistham
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
  
  // UPDATE LEAVE - HR Approve / Reject nokkithe status maruthundi
  // SQL lo: UPDATE leaves SET status='Approved' WHERE id=...
  function updateLeave(id, newStatus){
    let leaves = getLeaves();
    let leave = leaves.find(l => l.id === id);
    if(!leave) return;
    leave.status = newStatus;
    saveLeaves(leaves);
    showLeaves();
  }
  
  // PAGE OPEN AYINAPPUDU
  loadLeaveDropdown();
  showLeaves();