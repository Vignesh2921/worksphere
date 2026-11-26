function userExists(email){
    let users = JSON.parse(localStorage.getItem("worksphere_users") || "[]");
    return users.includes(email);
  }
  function saveUser(email){
    let users = JSON.parse(localStorage.getItem("worksphere_users") || "[]");
    if(!users.includes(email)){
      users.push(email);
      localStorage.setItem("worksphere_users", JSON.stringify(users));
    }
    localStorage.setItem("worksphere_user", email);
  }