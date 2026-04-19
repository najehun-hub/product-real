// --- Lotto Generator Logic ---
const generateBtn = document.getElementById('generate');
const resultDiv = document.getElementById('result');

// 가중치 분석 데이터 (최근 3년 빈출 번호 시뮬레이션 데이터)
const weightedNumbers = [
    1, 1, 1, 2, 3, 3, 4, 10, 10, 11, 12, 13, 14, 15, 17, 18, 18, 19, 20, 
    21, 24, 26, 27, 30, 33, 34, 34, 35, 37, 39, 40, 43, 44, 45
];

generateBtn.addEventListener('click', () => {
    resultDiv.innerHTML = '';
    
    // Generate 5 sets of numbers
    for (let i = 0; i < 5; i++) {
        const numbers = new Set();
        const isPremiumRow = (i === 2); // Mark the middle row as the Premium Recommended row
        
        // 빈출 데이터에서 번호 추출 (Premium 행은 더 많은 가중치 적용)
        const priorityCount = isPremiumRow ? 4 : (Math.floor(Math.random() * 2) + 2); 
        while (numbers.size < priorityCount) {
            const idx = Math.floor(Math.random() * weightedNumbers.length);
            numbers.add(weightedNumbers[idx]);
        }

        // 나머지 번호 무작위 추출
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
        
        // Create a row container for each set
        const row = document.createElement('div');
        row.classList.add('ball-row');
        if (isPremiumRow) {
            row.classList.add('premium-row');
            const badge = document.createElement('div');
            badge.classList.add('premium-badge');
            badge.textContent = 'PREMIUM RECOMMENDED';
            row.appendChild(badge);
        }
        
        sortedNumbers.forEach(number => {
            const ball = document.createElement('div');
            ball.classList.add('ball');
            ball.textContent = number;
            
            let color;
            if (number <= 10) color = '#fbc400';
            else if (number <= 20) color = '#69c8f2';
            else if (number <= 30) color = '#ff7272';
            else if (number <= 40) color = '#aaa';
            else color = '#b0d840';
            
            ball.style.backgroundColor = color;
            row.appendChild(ball);
        });
        
        resultDiv.appendChild(row);
    }
});
