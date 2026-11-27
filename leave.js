// I am handling leaves here - Apply, Approve, Reject
import { supabase } from './api.js'
let user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('worksphere_user') || 'null')
if(typeof user === 'string'){ try{ user = JSON.parse(user) }catch(e){ user = { email: user } } }
if(!user || !user.email) location.href = 'index.html'
document.getElementById('userEmail').innerText = user.email
window.logout = function(){ localStorage.clear(); sessionStorage.clear(); location.href = 'index.html' }

// I am filling employees in dropdown
async function loadLeaveDropdown(){
  let select = document.getElementById("leaveEmp"); if(!select) return
  let res = await supabase.from('users').select('*').eq('role','Employee')
  let data = res.data || []
  if(user.role !== 'HR'){
    let filtered = []
    for(let i=0; i<data.length; i++){ if(data[i].email === user.email){ filtered.push(data[i]) } }
    data = filtered
  }
  if(data.length === 0){ select.innerHTML = '<option value="">No Employee</option>'; return }
  let html = '<option value="">Select Employee</option>'
  for(let i=0; i<data.length; i++){
    let dept = data[i].dept || data[i].department
    html += '<option value="' + data[i].email + '">' + data[i].name + ' - ' + dept + '</option>'
  }
  select.innerHTML = html
}

// I am applying leave as Pending
window.applyLeave = async function(){
  let email = document.getElementById("leaveEmp").value
  let type = document.getElementById("leaveType").value
  let from = document.getElementById("leaveFrom").value
  let to = document.getElementById("leaveTo").value
  let reason = document.getElementById("leaveReason").value.trim()
  let msg = document.getElementById("leaveMsg")
  if(!email || !from || !to || !reason){ msg.innerText = "Please fill all leave details"; return }
  if(to < from){ msg.innerText = "To Date cannot be before From Date"; return }
  let empRes = await supabase.from('users').select('*').eq('email', email).single()
  let emp = empRes.data
  let empName = email
  if(emp && emp.name){ empName = emp.name }
  let res = await supabase.from('leaves').insert([{ name: empName, email: email, type: type, from_date: from, to_date: to, reason: reason, status: "Pending" }])
  if(res.error){ msg.innerText = res.error.message; return }
  document.getElementById("leaveReason").value = ""
  msg.style.color = "green"; msg.innerText = "Leave Applied - Waiting for Approval!"
  showLeaves()
}

// I am showing all leaves - HR sees all, Employee sees only his
async function showLeaves(){
  let table = document.getElementById("leaveTable"); if(!table) return
  let q = supabase.from('leaves').select('*').order('created_at',{ascending:false})
  if(user.role !== 'HR') q = q.eq('email', user.email)
  let res = await q
  let leaves = res.data || []
  if(leaves.length === 0){ table.innerHTML=""; document.getElementById("noLeave").style.display="block"; return }
  document.getElementById("noLeave").style.display="none"
  let html = ""
  for(let i=0; i<leaves.length; i++){
    let l = leaves[i]
    let badge = 'badge-pending'
    if(l.status === 'Approved'){ badge = 'badge-present' }
    if(l.status === 'Rejected'){ badge = 'badge-absent' }
    let buttons = '-'
    if(l.status === 'Pending' && user.role === 'HR'){
      buttons = '<button class="btn-approve" onclick="updateLeave(' + l.id + ', \'Approved\')">Approve</button> <button class="btn-reject" onclick="updateLeave(' + l.id + ', \'Rejected\')">Reject</button>'
    }
    html += '<tr><td>' + l.name + '</td><td>' + l.type + '</td><td>' + l.from_date + '</td><td>' + l.to_date + '</td><td>' + l.reason + '</td><td><span class="' + badge + '">' + l.status + '</span></td><td>' + buttons + '</td></tr>'
  }
  table.innerHTML = html
}

// I am updating leave status - HR only
window.updateLeave = async function(id, newStatus){
  await supabase.from('leaves').update({ status: newStatus }).eq('id', id)
  showLeaves()
}
loadLeaveDropdown(); showLeaves()