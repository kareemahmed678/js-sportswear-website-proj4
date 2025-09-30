let email = document.querySelector("#email")
let pwd = document.querySelector("#pwd")
let loginBtn = document.querySelector("#signin")
let getemail = localStorage.getItem("email")
let getpwd = localStorage.getItem("pwd")

loginBtn.addEventListener("click", function(e) {
    e.preventDefault()
    if (email.value === "" || pwd.value === "") {
        alert("Login details cannot be empty")
    } 
    else if(getemail && getemail.trim() === email.value && getpwd && getpwd.trim() === pwd.value) {
        alert("Login successful")
        setTimeout( () => {window.location = "index.html"}, 1500)
    }
    else {
        alert("Invalid login details")
    }
})