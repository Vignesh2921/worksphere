// ============================================================
// api.js - COMMON FILE
// Idi anni pages ki common.
// Panulu:
// 1. Login Check - Login avvakapothe login page ki pampisthundi
// 2. Logout
// 3. Database Functions - localStorage ni Database la vaduthunnam
// STEP 7 lo: Ikkade Backend API calls vasthay. Ex: fetch('/api/employees')
// Appudu migilina files maravu, kevalam ikkade maruthundi.
// ============================================================

// LOGIN CHECK - Prathi page open ayinappudu idi run avuthundi
let loggedUser = localStorage.getItem("worksphere_user");
if(!loggedUser){
  window.location.href = "index.html";
} else {
  // Sidebar lo email chupinchadam
  let emailEl = document.getElementById("userEmail");
  if(emailEl) emailEl.innerText = loggedUser;
}

// LOGOUT - Login data clear chesi login page ki pampisthundi
function logout(){
  localStorage.removeItem("worksphere_user");
  localStorage.removeItem("worksphere_role");
  window.location.href = "index.html";
}

// TODAY DATE - 2026-11-27 lanti format lo isthundi
function getToday(){
  return new Date().toISOString().split('T')[0];
}

// ---- DATABASE - EMPLOYEES ----
// SQL lo: SELECT * FROM employees
function getEmployees(){
  let data = localStorage.getItem("worksphere_employees");
  return data ? JSON.parse(data) : [];
}
// SQL lo: INSERT INTO employees
function saveEmployees(list){
  localStorage.setItem("worksphere_employees", JSON.stringify(list));
}

// ---- DATABASE - ATTENDANCE ----
// SQL lo: SELECT * FROM attendance
function getAttendance(){
  let data = localStorage.getItem("worksphere_attendance");
  return data ? JSON.parse(data) : [];
}
function saveAttendance(list){
  localStorage.setItem("worksphere_attendance", JSON.stringify(list));
}

// ---- DATABASE - LEAVES ----
// SQL lo: SELECT * FROM leaves
function getLeaves(){
  let data = localStorage.getItem("worksphere_leaves");
  return data ? JSON.parse(data) : [];
}
function saveLeaves(list){
  localStorage.setItem("worksphere_leaves", JSON.stringify(list));
}