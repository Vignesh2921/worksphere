// I am loading dashboard counts from Supabase
import { supabase } from './api.js'

// I am checking if I am logged in, if not I go to login page
let user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('worksphere_user') || 'null')
if(typeof user === 'string'){ try{ user = JSON.parse(user) }catch(e){ user = { email: user } } }
if(!user || !user.email) location.href = 'index.html'

document.getElementById('userEmail').innerText = user.email
document.getElementById('userRole').innerText = user.role || ''

// I am logging out by clearing my saved login
window.logout = () => {
  localStorage.clear(); sessionStorage.clear();
  location.href = 'index.html'
}
function getToday(){ return new Date().toISOString().split('T')[0] }

async function loadDashboard(){
  // I am getting all employees from users table
  let { data: emps } = await supabase.from('users').select('*').eq('role','Employee')
  if(!emps) emps = []
  document.getElementById('totalEmp').innerText = emps.length
  document.getElementById('totalDept').innerText = [...new Set(emps.map(e => e.dept || e.department))].length

  let table = document.getElementById('empTable')
  if(emps.length === 0){ table.innerHTML=''; document.getElementById('noEmp').style.display='block' }
  else {
    document.getElementById('noEmp').style.display='none'
    table.innerHTML = emps.slice(0,5).map(e => `<tr><td>${e.name}</td><td>${e.email}</td><td>${e.dept || e.department || '-'}</td><td>₹${e.basic_salary || 30000}</td></tr>`).join('')
  }

  // I am counting who is present today
  let today = getToday()
  let { data: att } = await supabase.from('attendance').select('*').eq('date', today)
  if(att) document.getElementById('presentToday').innerText = att.filter(a => a.status === 'Present').length

  // I am counting who is on approved leave today
  let { data: leaves } = await supabase.from('leaves').select('*').eq('status','Approved')
  if(leaves) document.getElementById('onLeaveToday').innerText = leaves.filter(l => (l.from_date || l.from) <= today && (l.to_date || l.to) >= today).length
}
loadDashboard()