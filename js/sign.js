import { url } from "./config.js";

window.onload = function() {
  const token = localStorage.getItem('token'); 
  if (token) {
    window.location.href = './index.html'; 
  }

  
  const loginForm = document.getElementById('loginForm');
  
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    login();
  });
};

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
    window.location.href = './index.html';
  } catch (error) {
    console.error(error.message);
    alert(error.message); 
  } 
}
