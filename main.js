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
    resultDiv.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    for (const number of sortedNumbers) {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.textContent = number;
        
        let color;
        if (number <= 10) {
            color = '#fbc400'; // gold
        } else if (number <= 20) {
            color = '#69c8f2'; // blue
        } else if (number <= 30) {
            color = '#ff7272'; // red
        } else if (number <= 40) {
            color = '#aaa'; // gray
        } else {
            color = '#b0d840'; // green
        }
        ball.style.backgroundColor = color;

        resultDiv.appendChild(ball);
    }
});