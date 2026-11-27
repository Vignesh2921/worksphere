// I am handling attendance here
import { supabase } from './api.js'
let user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('worksphere_user') || 'null')
if(typeof user === 'string'){ try{ user = JSON.parse(user) }catch(e){ user = { email: user, role: 'HR' } } }
if(!user || !user.email) location.href = 'index.html'
document.getElementById('userEmail').innerText = user.email
if(document.getElementById('userRole')) document.getElementById('userRole').innerText = user.role || ''
window.logout = function(){ localStorage.clear(); sessionStorage.clear(); location.href = 'index.html' }
function getToday(){ return new Date().toISOString().split('T')[0] }

// I am loading employees in dropdown - HR sees all, Employee sees only himself
async function loadAttDropdown(){
  let select = document.getElementById('attEmp')
  let res = await supabase.from('users').select('*').eq('role','Employee')
  let data = res.data || []
  if(user.role !== 'HR'){
    data = data.filter(function(e){ return e.email === user.email })
    document.getElementById('attSub').innerText = 'Mark your own attendance here.'
  }
  if(!data || data.length === 0){ select.innerHTML = '<option value="">No Employee - First Add Employee</option>'; return }
  let options = '<option value="">Select Employee</option>'
  for(let i=0; i<data.length; i++){
    let dept = data[i].dept || data[i].department || ''
    options += '<option value="' + data[i].email + '">' + data[i].name + ' - ' + dept + '</option>'
  }
  select.innerHTML = options
}
loadAttDropdown()

// I am marking attendance - if already marked today, I update it
window.markAttendance = async function(){
  let email = document.getElementById('attEmp').value
  let status = document.getElementById('attStatus').value
  let msg = document.getElementById('attMsg')
  let today = getToday()
  if(!email){ msg.innerText = 'Please select employee'; return }
  let empRes = await supabase.from('users').select('*').eq('email', email).single()
  let emp = empRes.data
  let name = email
  if(emp && emp.name){ name = emp.name }
  let exRes = await supabase.from('attendance').select('*').eq('email', email).eq('date', today).single()
  let existing = exRes.data
  if(existing){ await supabase.from('attendance').update({ status: status }).eq('id', existing.id) }
  else { await supabase.from('attendance').insert([{ name: name, email: email, status: status, date: today }]) }
  msg.style.color = 'green'; msg.innerText = 'Attendance Marked!'
  setTimeout(function(){ msg.innerText = '' }, 2000)
  showAttendance()
}

// I am showing today's attendance
async function showAttendance(){
  let today = getToday()
  let table = document.getElementById('attTable')
  let noAtt = document.getElementById('noAtt')
  let q = supabase.from('attendance').select('*').eq('date', today)
  if(user.role !== 'HR') q = q.eq('email', user.email)
  let res = await q
  let data = res.data || []
  if(data.length === 0){ table.innerHTML = ''; noAtt.style.display = 'block'; return }
  noAtt.style.display = 'none'
  let html = ''
  for(let i=0; i<data.length; i++){
    let badge = 'badge-absent'
    if(data[i].status === 'Present'){ badge = 'badge-present' }
    html += '<tr><td>' + data[i].name + '</td><td><span class="' + badge + '">' + data[i].status + '</span></td><td>' + data[i].date + '</td></tr>'
  }
  table.innerHTML = html
}
showAttendance()