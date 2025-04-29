document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    window.location.href = '/dashboard';
                } else {
                    loginError.textContent = data.message || 'Login failed. Please try again.';
                    loginError.style.display = 'block';
                }
            } catch (error) {
                loginError.textContent = 'An error occurred. Please try again.';
                loginError.style.display = 'block';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    window.location.href = '/dashboard';
                } else {
                    signupError.textContent = data.message || 'Signup failed. Please try again.';
                    signupError.style.display = 'block';
                }
            } catch (error) {
                signupError.textContent = 'An error occurred. Please try again.';
                signupError.style.display = 'block';
            }
        });
    }
});