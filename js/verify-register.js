import { url } from "./config.js";

window.onload = function() {
    const sendedRegistrationCode = localStorage.getItem('sendedRegistrationCode'); 
    if (!sendedRegistrationCode) {
        window.location.href = './reg.html'; 
    }
};
 
const email = localStorage.getItem('registerEmail'); 
const password = localStorage.getItem('registerPassword');

document.getElementById('verifyForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const code = document.getElementById('verificationCode').value;

    try {
        const response = await fetch(url + '/verify', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code, password }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Verification failed: ${errorData.error}`);
        }

        const result = await response.json();
        console.log('Verification successful:', result);
        alert('Verification successful!');


        localStorage.setItem('token', result.token);
        localStorage.setItem('verifiedUser', true); 
        window.location.href = './index.html'; 
    } catch (error) {
        console.error(error.message);
        alert(error.message); 
    }
});
