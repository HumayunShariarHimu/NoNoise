const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

let audioContext, microphone, invertedOutput;

startBtn.addEventListener('click', async () => {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Initialize AudioContext
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create audio nodes
        microphone = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        invertedOutput = audioContext.createGain();
        
        // Invert the phase of the microphone input
        gainNode.gain.value = -1; // Invert the signal
        microphone.connect(gainNode);
        gainNode.connect(invertedOutput);
        invertedOutput.connect(audioContext.destination);

        // Update button states
        startBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (error) {
        alert('Microphone access is required for this app to work!');
        console.error('Error accessing microphone:', error);
    }
});

stopBtn.addEventListener('click', () => {
    // Disconnect the audio nodes
    if (microphone) microphone.disconnect();
    if (invertedOutput) invertedOutput.disconnect();
    if (audioContext) audioContext.close();

    // Reset button states
    startBtn.disabled = false;
    stopBtn.disabled = true;
});