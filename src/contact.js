const check = () => {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!firstName || !lastName || !email || !phone || !message) {
    alert("Please enter all the details");
    return false;
  } else {
    alert("Your form is submitted");
    return true;
  }
};
