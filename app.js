function isValidEmail(email){
    // @ undha, . undha, @worksphere.com tho end avthundha
    let pattern = /^[a-zA-Z0-9._%+-]+@worksphere\.com$/;
    return pattern.test(email);
  }
  function isStrongPassword(pass){
    // 8+ , Capital, Number, Special Char
    let pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return pattern.test(pass);
  }
  function togglePass(){
    let p = document.getElementById("password");
    // Cursor problem fix - type marchi, cursor ni chivarlo pettam
    let val = p.value;
    p.type = p.type === "password" ? "text" : "password";
    p.value = val;
    p.focus();
  }
  function login(){
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value;
    if(!email || !pass){ showMsg("Please enter Email and Password"); return; }
    if(!isValidEmail(email)){ showMsg("Please enter valid company email. Example: name@worksphere.com"); return; }
    if(!isStrongPassword(pass)){ showMsg("Password must have 1 Capital, 1 Number, 1 Special Char, 8+ chars"); return; }
    if(userExists(email)){
      saveUser(email);
      showMsg("Login Successful! Redirecting...", "green");
      setTimeout(()=>{ location.reload(); }, 1000); // 1 sec taruvatha refresh
    } else {
      showMsg("Account not found. Please Sign Up first.");
    }
  }
  function signup(){
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value;
    if(!email || !pass){ showMsg("Please enter Email and Password"); return; }
    if(!isValidEmail(email)){ showMsg("Please use company email: name@worksphere.com"); return; }
    if(!isStrongPassword(pass)){ showMsg("Weak Password. Use 1 Capital, 1 Number, 1 Special Char"); return; }
    if(userExists(email)){ showMsg("Account already exists. Please Login."); return; }
    saveUser(email);
    showMsg("Account Created! Please Login.", "green");
    setTimeout(()=>{ location.reload(); }, 1000);
  }
  function googleSignup(){
    showMsg("Google Sign Up: Please use your company Google account (name@worksphere.com)");
  }
  function showMsg(t, color="red"){
    let m = document.getElementById("msg");
    m.innerText = t; m.style.color = color;
  }