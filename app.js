// I am checking if email is company email or not
function isValidEmail(email){
  let pattern = /^[a-zA-Z0-9._%+-]+@worksphere\.com$/;
  return pattern.test(email);
}

// I am checking password rule here
// My rule is: min 8 chars, 1 capital, 1 number, 1 special char
function isStrongPassword(pass){
  let pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
  return pattern.test(pass);
}

// I added this for eye icon, so user can see password
function togglePass(){
  let p = document.getElementById("password");
  let val = p.value;
  p.type = p.type === "password" ? "text" : "password";
  p.value = val;
  p.focus();
}

// I added shake effect when user enters wrong details
function doShake(){
  let box = document.getElementById("loginBox");
  box.classList.remove('shake');
  void box.offsetWidth; // I am restarting animation here
  box.classList.add('shake');
}

// I am clearing fields after login / signup, so they look clean
function clearFields(){
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

// I am handling login here
function login(){
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("password").value;

  if(!email || !pass){ showMsg("Please enter Email and Password"); doShake(); return; }
  if(!isValidEmail(email)){ showMsg("Please enter valid company email. Example: name@worksphere.com"); doShake(); return; }
  if(!isStrongPassword(pass)){ showMsg("Password must have 1 Capital, 1 Number, 1 Special Char, 8+ chars"); doShake(); return; }

  // I am checking if account exists, if not I am asking them to signup
  if(!userExists(email)){
    showMsg("Account not found. Please Sign Up first.");
    doShake();
    clearFields();
    document.getElementById("email").focus();
    return;
  }

  // I am checking password, if wrong I am clearing only password
  if(!checkUser(email, pass)){
    showMsg("Invalid password. Please try again.");
    doShake();
    document.getElementById("password").value = "";
    document.getElementById("password").focus();
    return;
  }

  // I logged in successfully, so I am saving user and going to dashboard
  localStorage.setItem("worksphere_user", email);
  showMsg("Login Successful! Redirecting...", "green");
  clearFields();
  setTimeout(()=>{
    window.location.href = "dashboard.html";
  }, 800);
}

// I am handling signup here
function signup(){
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("password").value;

  if(!email || !pass){ showMsg("Please enter Email and Password"); doShake(); return; }
  if(!isValidEmail(email)){ showMsg("Please use company email: name@worksphere.com"); doShake(); return; }
  if(!isStrongPassword(pass)){ showMsg("Weak Password. Use 1 Capital, 1 Number, 1 Special Char"); doShake(); return; }
  if(userExists(email)){ showMsg("Account already exists. Please Login."); doShake(); return; }

  // I am saving new user and asking them to login
  saveUser(email, pass);
  showMsg("Account Created! Please Login.", "green");
  clearFields();
  document.getElementById("email").focus();
}

// I will add real Google login later, for now just showing message
function googleSignup(){
  showMsg("Google Sign Up: Please use your company Google account (name@worksphere.com)");
}

// I am using this to show all messages
function showMsg(t, color="red"){
  let m = document.getElementById("msg");
  m.innerText = t; m.style.color = color;
}