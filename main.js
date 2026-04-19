const generateBtn = document.getElementById('generate');
const resultDiv = document.getElementById('result');

generateBtn.addEventListener('click', () => {
    resultDiv.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    for (const number of numbers) {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.textContent = number;
        
        let color;
        if (number <= 10) {
            color = 'gold';
        } else if (number <= 20) {
            color = 'dodgerblue';
        } else if (number <= 30) {
            color = 'crimson';
        } else if (number <= 40) {
            color = 'dimgray';
        } else {
            color = 'forestgreen';
        }
        ball.style.backgroundColor = color;

        resultDiv.appendChild(ball);
    }
});