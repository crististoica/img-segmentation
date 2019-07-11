const histogramBtn = document.querySelector('#show-histograms');
const histograms = document.querySelector('#histograms-div');
const hgotoMainBtn = document.querySelector('#h-goto-main');

const grayScaleCanvas = document.querySelector('#gray-scale');
const redScaleCanvas = document.querySelector('#red-scale');
const greenScaleCanvas = document.querySelector('#green-scale');
const blueScaleCanvas = document.querySelector('#blue-scale');

const grayScaleCtx = grayScaleCanvas.getContext('2d');
const redScaleCtx = redScaleCanvas.getContext('2d');
const greenScaleCtx = greenScaleCanvas.getContext('2d');
const blueScaleCtx = blueScaleCanvas.getContext('2d');

hgotoMainBtn.addEventListener('click', () => {
  mainDiv.style.display = 'flex';
  histograms.style.display = 'none';
  hgotoMainBtn.style.display = 'none';
});

histogramBtn.addEventListener('click', () => {
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const values = ['gray', 'red', 'green', 'blue'];

  redScaleCtx.clearRect(0, 0, canvas.width, canvas.height);
  greenScaleCtx.clearRect(0, 0, canvas.width, canvas.height);
  blueScaleCtx.clearRect(0, 0, canvas.width, canvas.height);
  grayScaleCtx.clearRect(0, 0, canvas.width, canvas.height);

  drawHistogram(redScaleCtx, pixels, values[1], redScaleCanvas, 'Red Level');
  drawHistogram(greenScaleCtx, pixels, values[2], greenScaleCanvas, 'Green Level');
  drawHistogram(blueScaleCtx, pixels, values[3], blueScaleCanvas, 'Blue Level');
  drawHistogram(grayScaleCtx, pixels, values[0], grayScaleCanvas, 'Gray Level');

  mainDiv.style.display = 'none';
  histograms.style.display = 'flex';
  hgotoMainBtn.style.display = 'block';
});



function drawHistogram(ctx, pixels, val, canvas, txt) {
  const grayHistogram = {};
  const redHistogram = {};
  const greenHistogram = {};
  const blueHistogram = {};

  drawGraph(ctx, canvas, txt);
  if (val == 'gray') {
    // draw gray scale graph
    let grayPixels = toGrayScale(pixels);

    for (let i = 0; i < grayPixels.data.length; i += 4) {
      const val = grayPixels.data[i];
      if (grayHistogram.hasOwnProperty(val)) {
        grayHistogram[val]++;
      } else {
        grayHistogram[val] = 0;
      }
    }

    const values = [...Object.keys(grayHistogram)].map(val => val = parseInt(val));
    for (let i = 0; i < values.length; i++) {

      ctx.fillStyle = 'gray';
      ctx.rect(
        50 + i * 3,
        canvas.height - 50 - mapValue(grayHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(grayHistogram[values[i]], 0, 20000, 0, 330)
      );
      ctx.fillRect(
        50 + i * 3,
        canvas.height - 50 - mapValue(grayHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(grayHistogram[values[i]], 0, 20000, 0, 330)
      );
      ctx.strokeRect(
        50 + i * 3,
        canvas.height - 50 - mapValue(grayHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(grayHistogram[values[i]], 0, 20000, 0, 330)
      );
    }
  } else if (val == 'red') {
    // draw red scale graph

    for (let i = 0; i < pixels.data.length; i += 4) {
      const val = pixels.data[i];
      if (redHistogram.hasOwnProperty(val)) {
        redHistogram[val]++;
      } else {
        redHistogram[val] = 0;
      }
    }

    const values = [...Object.keys(redHistogram)].map(val => val = parseInt(val));
    for (let i = 0; i < values.length; i++) {

      ctx.fillStyle = 'red';
      ctx.rect(
        50 + i * 3,
        canvas.height - 50 - mapValue(redHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(redHistogram[values[i]], 0, 20000, 0, 330)
      );
      ctx.fillRect(
        50 + i * 3,
        canvas.height - 50 - mapValue(redHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(redHistogram[values[i]], 0, 20000, 0, 330)
      );
      ctx.strokeRect(
        50 + i * 3,
        canvas.height - 50 - mapValue(redHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(redHistogram[values[i]], 0, 20000, 0, 330)
      );
    }
  } else if (val == 'green') {
    // draw green scale graph

    for (let i = 0; i < pixels.data.length; i += 4) {
      const val = pixels.data[i + 1];
      if (greenHistogram.hasOwnProperty(val)) {
        greenHistogram[val]++;
      } else {
        greenHistogram[val] = 0;
      }
    }

    const values = [...Object.keys(greenHistogram)].map(val => val = parseInt(val));
    for (let i = 0; i < values.length; i++) {

      ctx.fillStyle = 'green';
      ctx.rect(
        50 + i * 3,
        canvas.height - 50 - mapValue(greenHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(greenHistogram[values[i]], 0, 20000, 0, 330)
      );
      ctx.fillRect(
        50 + i * 3,
        canvas.height - 50 - mapValue(greenHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(greenHistogram[values[i]], 0, 20000, 0, 330)
      );
      ctx.strokeRect(
        50 + i * 3,
        canvas.height - 50 - mapValue(greenHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(greenHistogram[values[i]], 0, 20000, 0, 330)
      );
    }
  } else if (val == 'blue') {
    // draw blue scale graph

    for (let i = 0; i < pixels.data.length; i += 4) {
      const val = pixels.data[i + 2];
      if (blueHistogram.hasOwnProperty(val)) {
        blueHistogram[val]++;
      } else {
        blueHistogram[val] = 0;
      }
    }

    const values = [...Object.keys(blueHistogram)].map(val => val = parseInt(val));
    for (let i = 0; i < values.length; i++) {

      ctx.fillStyle = 'blue';
      ctx.rect(
        50 + i * 3,
        canvas.height - 50 - mapValue(blueHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(blueHistogram[values[i]], 0, 20000, 0, 330)
      );
      ctx.fillRect(
        50 + i * 3,
        canvas.height - 50 - mapValue(blueHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(blueHistogram[values[i]], 0, 20000, 0, 330)
      );
      ctx.strokeRect(
        50 + i * 3,
        canvas.height - 50 - mapValue(blueHistogram[values[i]], 0, 20000, 0, 330),
        3,
        mapValue(blueHistogram[values[i]], 0, 20000, 0, 330)
      );
    }
  }
}

// reduce o valoare dintr-un interval la o valoare intr-un nou interval
function mapValue(val, a1, a2, b1, b2) {
  return b1 + ((val - a1) * (b2 - b1)) / (a2 - a1);
}

// deseneaza un grafic
function drawGraph(ctx, canvas, txt) {
  ctx.beginPath();
  // x axis
  ctx.moveTo(50, canvas.height - 50);
  ctx.lineTo(canvas.width - 55, canvas.height - 50);
  ctx.lineTo(canvas.width - 60, canvas.height - 55);
  ctx.lineTo(canvas.width - 60, canvas.height - 45);
  ctx.lineTo(canvas.width - 55, canvas.height - 50);
  // y axis
  ctx.moveTo(50, canvas.height - 50);
  ctx.lineTo(50, canvas.height - 380);
  ctx.lineTo(45, canvas.height - 375);
  ctx.lineTo(55, canvas.height - 375);
  ctx.lineTo(50, canvas.height - 380);

  ctx.stroke();
  ctx.fill();

  ctx.font = "15px Arial";
  ctx.fillStyle = '#fff';
  ctx.fillText('0', 35, canvas.height - 30);
  ctx.fillText('20000', 15, 20);
  ctx.fillText('255', canvas.width - 100, canvas.height - 30);
  ctx.fillText(txt, 350, canvas.height - 30);

  ctx.save();
  ctx.translate(35, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Pixels', 0, 0);
  ctx.restore();
}


function drawGrayScale() {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = toGrayScale(pixels);

  ctx.putImageData(pixels, 0, 0);

}