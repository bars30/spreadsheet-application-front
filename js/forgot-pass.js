import { url } from "./config.js";

document.getElementById('requestCodeBtn').addEventListener('click', async () => {
    const email = document.getElementById('forgotEmail').value;

    if (!email) {
        alert('Please enter your email.');
        return;
    }

    try {
        const response = await fetch(url + '/forgot-password', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.error}`);
        }

        const result = await response.json();
        window.location.href = './reset-password.html?email=' + encodeURIComponent(email);
    } catch (error) {
        console.error(error.message);
    }
});
