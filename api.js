// We are storing users in localStorage for now.
// Later we will move this to a real database, but for Day 1 this is enough.

// Get all users from browser storage
function getUsers(){
    let users = JSON.parse(localStorage.getItem("worksphere_users") || "[]");
    // Old data was just email strings, converting them to objects so password check won't break
    return users.map(u => {
      if(typeof u === "string") return { email: u, password: "" };
      return u;
    });
  }
  
  // Check if this email is already registered
  function userExists(email){
    return getUsers().some(u => u.email === email);
  }
  
  // Check email + password together, both should match
  function checkUser(email, pass){
    return getUsers().find(u => u.email === email && u.password === pass);
  }
  
  // Save new user, only if not already there
  function saveUser(email, pass){
    let users = getUsers();
    if(!users.some(u => u.email === email)){
      users.push({ email: email, password: pass });
      localStorage.setItem("worksphere_users", JSON.stringify(users));
    }
  }