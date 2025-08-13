const submit = document
  .querySelector("#submit")
  .addEventListener("click", () => {
    check();
  });
// const form = document.querySelector("#form");
const firstName = document.querySelector("#firstName").value.trim();
const lastName = document.querySelector("#lastName").value.trim();
const email = document.querySelector("#email").value.trim();
const phone = document.querySelector("#phone").value.trim();
const message = document.querySelector("#message").value.trim();

const check = () => {
  if (!firstName || !lastName || !email || !phone || !message) {
    alert("please enter the details");
    return false;
  } else {
    alert("Your form is submitted");
  }
};
