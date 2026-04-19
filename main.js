const generateBtn = document.getElementById('generate');
const resultDiv = document.getElementById('result');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggle logic
function updateThemeButton(isDark) {
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeButton(true);
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton(isDark);
});

generateBtn.addEventListener('click', () => {
...
    for (const number of numbers) {
...
        ball.style.backgroundColor = color;

        resultDiv.appendChild(ball);
    }
});