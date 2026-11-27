// I am checking if user is logged in, if not I am sending back to login
let loggedUser = localStorage.getItem("worksphere_user");
if(!loggedUser){
  window.location.href = "index.html";
} else {
  // I am showing logged in email in sidebar
  document.getElementById("userEmail").innerText = loggedUser;
}

// I added logout, it clears user and goes to login page
function logout(){
  localStorage.removeItem("worksphere_user");
  window.location.href = "index.html";
}