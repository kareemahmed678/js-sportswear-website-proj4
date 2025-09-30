let firstName = document.querySelector("#firstname")
let lastName = document.querySelector("#lastname")
let email = document.querySelector("#email")
let pwd = document.querySelector("#pwd")
let registerBtn = document.querySelector("#signup")

registerBtn.addEventListener("click", function(e){
    e.preventDefault()
    if (firstName.value === "" || lastName.value === "" || email.value === "" || pwd.value === ""){
        alert("Please fill data")
    }
    else{
        localStorage.setItem("firstName", firstName.value)
        localStorage.setItem("lastName", lastName.value)
        localStorage.setItem("email", email.value)
        localStorage.setItem("pwd", pwd.value)
        alert("Account Created Successfully")
        setTimeout( () => {window.location = "login.html"}, 1500)
    }
})