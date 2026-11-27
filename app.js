// I am handling login here
// I check email + password in Supabase users table
import { supabase } from './api.js'

window.togglePass = function(){
  let p = document.getElementById("password");
  p.type = p.type === "password" ? "text" : "password";
}

window.login = async function(){
  let email = document.getElementById("email").value.trim().toLowerCase();
  let pass = document.getElementById("password").value.trim();
  let msg = document.getElementById("msg");
  if(!email || !pass){ msg.innerText = "Please enter Email & Password"; return; }

  let { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', pass);

  if(error || !data || data.length === 0){ msg.innerText = "Login Failed: Wrong Email or Password"; return; }

  let user = data[0];
  // I am saving full user as JSON, so all pages can read my role and email
  let userJson = JSON.stringify(user);
  localStorage.setItem("user", userJson);
  localStorage.setItem("currentUser", userJson);
  localStorage.setItem("worksphere_user", userJson);
  localStorage.setItem("worksphere_role", user.role);
  localStorage.setItem("worksphere_name", user.name);

  msg.innerText = "Login Success! Welcome " + user.name;
  window.location.href = "dashboard.html";
}