import { url  } from "./config.js";

window.onload = function() {
  const token = localStorage.getItem('token'); 
  if (token) {
    window.location.href = './index.html'; 
  }
};
loginForm = document.getElementById('loginForm');
registerForm = document.getElementById('registerForm');

async function register() {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  console.log(JSON.stringify({ email, password }));

  const fetchUrl = url + "/register";
  try {
    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Registration failed: ${errorData.error}`);
    }

    const json = await response.json();
    console.log('Registration successful:', json);
    alert('Registration successful!');
    localStorage.setItem('registerEmail', email);
    localStorage.setItem('registerPassword', password);
    localStorage.setItem('sendedRegistrationCode', true); 
    window.location.href = './verify-register.html';
  } catch (error) {
    console.error(error.message);
    alert(error.message); 
  } 
}

async function getData() {
  const fetchUrl = url + "/data";
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

async function getData2() {
  const fetchUrl = url + "/users";
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const fetchUrl = url + "/login"; 

  try {
    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Login failed: ${errorData.error}`);
    }

    const json = await response.json();
    console.log('Login successful:', json);
    alert('Login successful!');
    localStorage.setItem('token', json.token); 
    localStorage.setItem('email', email);
    window.location.href = './index.html';
  } catch (error) {
    console.error(error.message);
    alert(error.message); 
  }
}



loginForm?.addEventListener("submit", (event)=>{
  if (loginPassword.value.length < 6) {
    event.preventDefault();
    return;

  }
  event.preventDefault();
  login()
})
registerForm?.addEventListener("submit", (event)=>{
  event.preventDefault();
  register()
})


