function extractText() {
  const imageInput = document.getElementById("imageInput");
  const resultBox = document.getElementById("ocrResult");

  if (!imageInput.files[0]) {
    resultBox.textContent = "Please select an image first.";
    return;
  }

  resultBox.textContent = "Processing OCR...";

  Tesseract.recognize(
    imageInput.files[0],
    'eng',
    {
      logger: m => console.log(m)
    }
  ).then(({ data: { text } }) => {
    resultBox.textContent = text;
    // Try auto-filling times if possible
    const numbers = text.match(/[\d.]+/g);
    if (numbers && numbers.length >= 5) {
      document.getElementById("timesInput").value = numbers.slice(0, 5).join(" ");
    }
  }).catch(err => {
    resultBox.textContent = "OCR error: " + err.message;
  });
}

function calculateAverage() {
  const input = document.getElementById("timesInput").value.trim();
  const resultDiv = document.getElementById("avgResult");

  let times = input.split(" ").map(Number).filter(n => !isNaN(n));

  if (times.length < 5) {
    resultDiv.textContent = "Enter at least 5 valid times.";
    return;
  }

  times = times.slice(0, 5);
  const best = Math.min(...times);
  const worst = Math.max(...times);
  const filtered = times.filter(t => t !== best && t !== worst);

  // Handle duplicate best/worst edge cases
  while (filtered.length > 3) filtered.pop();

  if (filtered.length !== 3) {
    resultDiv.textContent = "Could not compute average correctly.";
    return;
  }

  const avg = filtered.reduce((a, b) => a + b, 0) / 3;
  resultDiv.innerHTML = `
    <p>Best: ${best}</p>
    <p>Worst: ${worst}</p>
    <p><strong>Average: ${avg.toFixed(2)}</strong></p>
  `;
}
