// Tab Switching Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const updateThemeButton = (isDark) => {
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
};

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
        
        // 빈출 데이터에서 2~3개 번호 우선 추출
        const priorityCount = Math.floor(Math.random() * 2) + 2; 
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

// --- AI Gender Test Logic ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/eDmjog7_r/";
let model, webcam, labelContainer, maxPredictions;

// Load the image model
async function initModel() {
    if (model) return;
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
}

// Prediction Logic
async function predict(imageElement) {
    await initModel();
    const prediction = await model.predict(imageElement);
    
    labelContainer.innerHTML = '';
    prediction.sort((a, b) => b.probability - a.probability);

    prediction.forEach(p => {
        const percentage = (p.probability * 100).toFixed(0);
        const barColor = p.className === '남자' ? '#4a90e2' : '#ff7272';
        
        const resHtml = `
            <div class="result-bar">
                <div class="bar-label">
                    <span>${p.className}</span>
                    <span>${percentage}%</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${percentage}%; background-color: ${barColor}"></div>
                </div>
            </div>
        `;
        labelContainer.innerHTML += resHtml;
    });

    document.getElementById('loading').style.display = 'none';
    document.getElementById('prediction-result').style.display = 'block';
}

// File Upload Handling
const imageUpload = document.getElementById('image-upload');
const uploadArea = document.getElementById('upload-area');
const faceImage = document.getElementById('face-image');

function handleImage(file) {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        faceImage.src = e.target.result;
        uploadArea.style.display = 'none';
        document.getElementById('webcam-container').style.display = 'none';
        document.querySelector('.input-switch').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
        
        // Wait for image to load before predicting
        faceImage.onload = () => predict(faceImage);
    };
    reader.readAsDataURL(file);
}

imageUpload.addEventListener('change', (e) => handleImage(e.target.files[0]));

// Drag & Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleImage(e.dataTransfer.files[0]);
});

// Webcam Handling
const toggleWebcamBtn = document.getElementById('toggle-webcam');
const webcamContainer = document.getElementById('webcam-container');
const captureBtn = document.getElementById('capture-btn');

toggleWebcamBtn.addEventListener('click', async () => {
    if (webcamContainer.style.display === 'none') {
        uploadArea.style.display = 'none';
        webcamContainer.style.display = 'block';
        toggleWebcamBtn.textContent = '사진 업로드 사용하기';
        
        const flip = true;
        webcam = new tmImage.Webcam(320, 320, flip);
        await webcam.setup();
        await webcam.play();
        document.getElementById("webcam-wrapper").appendChild(webcam.canvas);
        window.requestAnimationFrame(loop);
    } else {
        stopWebcam();
        uploadArea.style.display = 'block';
        webcamContainer.style.display = 'none';
        toggleWebcamBtn.textContent = '카메라 사용하기';
    }
});

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        window.requestAnimationFrame(loop);
    }
}

function stopWebcam() {
    if (webcam) {
        webcam.stop();
        const canvas = document.querySelector('#webcam-wrapper canvas');
        if (canvas) canvas.remove();
        webcam = null;
    }
}

captureBtn.addEventListener('click', () => {
    if (webcam) {
        const canvas = webcam.canvas;
        faceImage.src = canvas.toDataURL('image/png');
        stopWebcam();
        
        webcamContainer.style.display = 'none';
        document.querySelector('.input-switch').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
        
        faceImage.onload = () => predict(faceImage);
    }
});

// Retry logic
document.getElementById('retry-btn').addEventListener('click', () => {
    document.getElementById('prediction-result').style.display = 'none';
    uploadArea.style.display = 'block';
    document.querySelector('.input-switch').style.display = 'block';
    imageUpload.value = '';
    faceImage.src = '';
});
