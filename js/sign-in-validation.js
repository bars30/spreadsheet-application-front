const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const signUpBtn = document.getElementById('signUpBtn');

const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const passwordComplexityError = document.getElementById('passwordComplexityError');

registerEmail.addEventListener('input', function() {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(registerEmail.value)) {
    emailError.style.display = 'block';
    signUpBtn.disabled = true;
  } else {
    emailError.style.display = 'none';
    validateForm();
  }
});

registerPassword.addEventListener('input', function() {
  const passwordValue = registerPassword.value;

  if (passwordValue.length < 6) {
    passwordError.style.display = 'block';
    signUpBtn.disabled = true;
  } else {
    passwordError.style.display = 'none';
  }

  const complexityPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
  if (!complexityPattern.test(passwordValue)) {
    passwordComplexityError.style.display = 'block';
    signUpBtn.disabled = true;
  } else {
    passwordComplexityError.style.display = 'none';
  }

  validateForm();
});

function validateForm() {
  if (
    emailError.style.display === 'none' &&
    passwordError.style.display === 'none' &&
    passwordComplexityError.style.display === 'none'
  ) {
    signUpBtn.disabled = false;
  } else {
    signUpBtn.disabled = true;
  }
}
