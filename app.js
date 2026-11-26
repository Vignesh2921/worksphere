// Email should be company email only, like name@worksphere.com
function isValidEmail(email){
    let pattern = /^[a-zA-Z0-9._%+-]+@worksphere\.com$/;
    return pattern.test(email);
  }
  
  // Password rule: min 8 chars, 1 capital, 1 number, 1 special char
  function isStrongPassword(pass){
    let pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return pattern.test(pass);
  }
  
  // Show / hide password, without losing cursor position
  function togglePass(){
    let p = document.getElementById("password");
    let val = p.value;
    p.type = p.type === "password" ? "text" : "password";
    p.value = val;
    p.focus();
  }
  
  // Shake the login box when something is wrong
  function doShake(){
    let box = document.getElementById("loginBox");
    box.classList.remove('shake');
    void box.offsetWidth; // restart animation
    box.classList.add('shake');
  }
  
  // Clear both fields after success or when account not found
  function clearFields(){
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }
  
  // Login button clicked
  function login(){
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value;
  
    // Basic empty check first
    if(!email || !pass){ showMsg("Please enter Email and Password"); doShake(); return; }
    if(!isValidEmail(email)){ showMsg("Please enter valid company email. Example: name@worksphere.com"); doShake(); return; }
    if(!isStrongPassword(pass)){ showMsg("Password must have 1 Capital, 1 Number, 1 Special Char, 8+ chars"); doShake(); return; }
  
    // If account doesn't exist, no point checking password, just clear and tell them to sign up
    if(!userExists(email)){
      showMsg("Account not found. Please Sign Up first.");
      doShake();
      clearFields();
      document.getElementById("email").focus();
      return;
    }
  
    // Account exists but password is wrong, clear only password so they can try again quickly
    if(!checkUser(email, pass)){
      showMsg("Invalid password. Please try again.");
      doShake();
      document.getElementById("password").value = "";
      document.getElementById("password").focus();
      return;
    }
  
    // Everything matched, login success
    localStorage.setItem("worksphere_user", email);
    showMsg("Login Successful! Welcome " + email, "green");
    clearFields();
  }
  
  // Sign Up button clicked
  function signup(){
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value;
  
    if(!email || !pass){ showMsg("Please enter Email and Password"); doShake(); return; }
    if(!isValidEmail(email)){ showMsg("Please use company email: name@worksphere.com"); doShake(); return; }
    if(!isStrongPassword(pass)){ showMsg("Weak Password. Use 1 Capital, 1 Number, 1 Special Char"); doShake(); return; }
  
    // Already have an account? Then just login, no need to create again
    if(userExists(email)){ showMsg("Account already exists. Please Login."); doShake(); return; }
  
    // New user, save and ask them to login now
    saveUser(email, pass);
    showMsg("Account Created! Please Login.", "green");
    clearFields();
    document.getElementById("email").focus();
  }
  
  // Google button for now, just a message, we will add real Google login later
  function googleSignup(){
    showMsg("Google Sign Up: Please use your company Google account (name@worksphere.com)");
  }
  
  // Helper to show messages in red or green
  function showMsg(t, color="red"){
    let m = document.getElementById("msg");
    m.innerText = t; m.style.color = color;
  }