import { supabase } from './api.js'

let user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('currentUser') || localStorage.getItem('loggedInUser') || localStorage.getItem('worksphere_user') || sessionStorage.getItem('user') || 'null')
if(!user) location.href = 'index.html'

let empSelect = document.getElementById('empSelect')
let list = document.getElementById('list')

if(user.role !== 'HR') {
  document.getElementById('hrForm').style.display = 'none'
}

// 1. Employees Load
async function loadEmps(){
  let { data } = await supabase.from('users').select('*').eq('role','Employee')
  if(!data || data.length === 0){
    empSelect.innerHTML = `<option>No Employees</option>`
    return
  }
  empSelect.innerHTML = data.map(e=>`<option value="${e.email}" data-name="${e.name}">${e.name} - ${e.email}</option>`).join('')
  // First employee ni auto select chesi salary fill chey
  autoFillSalary()
}
loadEmps()

// 2. Employee Select chesagane Fixed Salary Auto Fill
async function autoFillSalary(){
  let email = empSelect.value
  if(!email) return
  let { data } = await supabase.from('users').select('*').eq('email', email).single()
  if(!data) return

  let basic = data.basic_salary || 30000
  let hra = Math.round(basic * 0.40) // HRA 40%
  let pf = Math.round(basic * 0.12)  // PF 12%
  let allow = data.allowances || 2000

  document.getElementById('basic').value = basic
  document.getElementById('hra').value = hra
  document.getElementById('pf').value = pf
  document.getElementById('allow').value = allow
  calcNet()
}
empSelect.addEventListener('change', autoFillSalary)

// 3. Net Salary Live Calculate
function calcNet(){
  let basic = +document.getElementById('basic').value || 0
  let hra = +document.getElementById('hra').value || 0
  let allow = +document.getElementById('allow').value || 0
  let pf = +document.getElementById('pf').value || 0
  let deduct = +document.getElementById('deduct').value || 0
  let lopDays = +document.getElementById('lopDays').value || 0

  let perDay = basic / 30
  let lopAmount = Math.round(perDay * lopDays)
  let net = basic + hra + allow - pf - lopAmount - deduct

  document.getElementById('netPreview').innerText = `Net Salary: ₹${net} (LOP Cut: ₹${lopAmount})`
  return { net, lopAmount }
}

// Inputs marithe malli calculate avvali
['basic','hra','allow','pf','deduct','lopDays','paidLeaves'].forEach(id => {
  let el = document.getElementById(id)
  if(el) el.addEventListener('input', calcNet)
})

// 4. Slips Load
async function loadSlips(){
  let q = supabase.from('salary_slips').select('*').order('created_at',{ascending:false})
  if(user.role !== 'HR') q = q.eq('employee_email', user.email)
  let { data } = await q
  if(!data || data.length === 0){
    list.innerHTML = `<tr><td colspan="8">No Slips Found</td></tr>`
    return
  }
  list.innerHTML = data.map(s=>`<tr>
    <td>${s.employee_name}</td>
    <td>${s.month}</td>
    <td>₹${s.basic}</td>
    <td>₹${s.hra}</td>
    <td>₹${s.pf || 0}</td>
    <td>${s.lop_days || 0} Days</td>
    <td><b>₹${s.net_salary}</b></td>
    <td><button onclick="downloadPDF('${s.employee_name}','${s.month}',${s.basic},${s.hra},${s.allowances},${s.deductions},${s.net_salary},${s.pf || 0},${s.lop_days || 0},${s.lop_amount || 0})">PDF</button></td>
  </tr>`).join('')
}
loadSlips()

// 5. Generate Slip - Supabase lo Save
window.generateSlip = async () => {
  let opt = empSelect.selectedOptions[0]
  let basic = +document.getElementById('basic').value || 0
  let hra = +document.getElementById('hra').value || 0
  let allow = +document.getElementById('allow').value || 0
  let pf = +document.getElementById('pf').value || 0
  let deduct = +document.getElementById('deduct').value || 0
  let lopDays = +document.getElementById('lopDays').value || 0
  let paidLeaves = +document.getElementById('paidLeaves').value || 0
  let month = document.getElementById('month').value
  if(!month) return alert('Month select chey!')

  let { net, lopAmount } = calcNet()

  let { error } = await supabase.from('salary_slips').insert([{
    employee_email: opt.value,
    employee_name: opt.dataset.name,
    month, basic, hra, allowances: allow, deductions: deduct,
    pf, lop_days: lopDays, lop_amount: lopAmount, paid_leaves: paidLeaves,
    net_salary: net
  }])
  if(error) return alert(error.message)
  alert('Slip Saved! Net: ₹' + net)
  downloadPDF(opt.dataset.name, month, basic, hra, allow, deduct, net, pf, lopDays, lopAmount)
  loadSlips()
}

// 6. PDF with PF + LOP
window.downloadPDF = (name, month, basic, hra, allow, deduct, net, pf, lopDays, lopAmount) => {
  const { jsPDF } = window.jspdf
  let doc = new jsPDF()
  doc.setFontSize(20); doc.text('WorkSphere - Salary Slip', 20, 20)
  doc.setFontSize(12)
  doc.text(`Employee: ${name}`, 20, 40)
  doc.text(`Month: ${month}`, 20, 50)
  doc.text(`Basic: Rs.${basic}`, 20, 70)
  doc.text(`HRA: Rs.${hra}`, 20, 80)
  doc.text(`Allowances: Rs.${allow}`, 20, 90)
  doc.text(`PF (12%): Rs.${pf}`, 20, 100)
  doc.text(`LOP Days: ${lopDays} - Cut: Rs.${lopAmount}`, 20, 110)
  doc.text(`Other Deductions: Rs.${deduct}`, 20, 120)
  doc.setFontSize(14); doc.text(`Net Salary: Rs.${net}`, 20, 140)
  doc.save(`${name}-${month}-slip.pdf`)
}

window.logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('loggedInUser')
  localStorage.removeItem('worksphere_user')
  sessionStorage.removeItem('user')
  location.href = 'index.html'
}