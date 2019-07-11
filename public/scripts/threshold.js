const thresholdValue = document.querySelector("#threshold-value");
const applyThreshold = document.querySelector("#apply-threshold");
const higher_color = document.querySelector("#higher-color");
const lower_color = document.querySelector("#lower-color");
const thresholdTitle = document.querySelector("#threshold-title");
const applyAdaptiveThreshold = document.querySelector('#apply-adaptive-threshold');

const colorThrBtn = document.querySelector('#color-threshold');
const cColor = document.querySelector('#c-color');
const colorTValue = document.querySelector('#color-t-value');

const constantValue = document.querySelector('#c-value');
const regionSize = document.querySelector('#R-size-value');
const localThrBtn = document.querySelector('#local-threshold');

let higherColor = hexToRgb(higher_color.value);
let lowerColor = hexToRgb(lower_color.value);

higher_color.addEventListener("change", () => {
  higherColor = hexToRgb(higher_color.value);
});

lower_color.addEventListener("change", () => {
  lowerColor = hexToRgb(lower_color.value);
});

applyThreshold.addEventListener("click", e => {
  e.preventDefault();
  drawThreshold();
  TITLE = thresholdTitle.innerHTML + " - " + thresholdValue.value.toString();
});

applyAdaptiveThreshold.addEventListener('click', (e) => {
  e.preventDefault();
  drawAdaptiveThreshold();
  TITLE = 'Threshold Automat';
});

colorThrBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let c = cColor.value;
  if (colorTValue.value) {
    drawColorT(c, colorTValue.value);
  } else {
    drawColorT(c);
  }
  TITLE = 'Color Threshold'
});

localThrBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const R = regionSize.value
  const C = constantValue.value;
  drawLocalTh(R || 7, C || 2);
  TITLE = `Threshold Local C = ${C || 7} R= ${R || 2}`;
});

function thresholdSeg(pixels) {
  const threshold = thresholdValue.value;

  for (let i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];

    const total = (red + green + blue) / 3;

    if (total < threshold) {
      pixels.data[i] = lowerColor.r;
      pixels.data[i + 1] = lowerColor.g;
      pixels.data[i + 2] = lowerColor.b;
    } else {
      pixels.data[i] = higherColor.r;
      pixels.data[i + 1] = higherColor.g;
      pixels.data[i + 2] = higherColor.b;
    }
  }
  return pixels;
}

function adaptiveThreshold(pixels) {
  let T = 127;
  let G1 = [];
  let G2 = [];
  let m1, m2;
  let previousThreshold = 0;
  let n = 0;

  while (previousThreshold != T) {
    if (n > 15) break;
    n++;
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i] > T) {
        G1.push(pixels.data[i]);
      } else {
        G2.push(pixels.data[i]);
      }
    }

    m1 = getMeanValue(G1);
    m2 = getMeanValue(G2);
    previousThreshold = T;
    T = Math.floor((m1 + m2) / 2);
    G1 = [];
    G2 = [];
  }


  for (let i = 0; i < pixels.data.length; i += 4) {
    if (pixels.data[i] > T) {
      pixels.data[i] = higherColor.r;
      pixels.data[i + 1] = higherColor.g;
      pixels.data[i + 2] = higherColor.b;
    } else {
      pixels.data[i] = lowerColor.r;
      pixels.data[i + 1] = lowerColor.g;
      pixels.data[i + 2] = lowerColor.b;
    }
  }
  return pixels;
}


function getMeanValue(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }

  return Math.floor(total / arr.length);
}

function toGrayScale(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    const grayScale = {
      r: pixels.data[i] * 0.3,
      g: pixels.data[i + 1] * 0.59,
      b: pixels.data[i + 2] * 0.11
    };

    const gray = grayScale.r + grayScale.g + grayScale.b;
    pixels.data[i] = gray;
    pixels.data[i + 1] = gray;
    pixels.data[i + 2] = gray;
  }

  return pixels;
}

function getThreshold(pixels, color) {
  let T = Math.floor(Math.random() * 255);
  let G1 = [];
  let G2 = [];
  let m1, m2;
  let previousThreshold = 0;
  let n = 0;

  while (previousThreshold != T) {
    if (n > 15) break;
    n++;
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (color === 'red') {
        if (pixels.data[i] > T) {
          G1.push(pixels.data[i]);
        } else {
          G2.push(pixels.data[i]);
        }
      } else if (color === 'green') {
        if (pixels.data[i + 1] > T) {
          G1.push(pixels.data[i + 1]);
        } else {
          G2.push(pixels.data[i + 1]);
        }
      } else if (color === 'blue') {
        if (pixels.data[i + 2] > T) {
          G1.push(pixels.data[i + 2]);
        } else {
          G2.push(pixels.data[i + 2]);
        }
      }
    }

    m1 = getMeanValue(G1);
    m2 = getMeanValue(G2);
    previousThreshold = T;
    T = Math.floor((m1 + m2) / 2);
    G1 = [];
    G2 = [];
  }
  return T;
}
// threshold pe culoare
function colorThreshold(pixels, color, T) {
  const T_red = T || getThreshold(pixels, 'red');
  const T_green = T || getThreshold(pixels, 'green');
  const T_blue = T || getThreshold(pixels, 'blue');

  for (let i = 0; i < pixels.data.length; i += 4) {
    if (color === 'red') {
      if (pixels.data[i] > T_red) {
        pixels.data[i] = 255;
        pixels.data[i + 1] = 0;
        pixels.data[i + 2] = 0
      }
    } else if (color === 'green') {
      if (pixels.data[i + 1] > T_green) {
        pixels.data[i] = 0;
        pixels.data[i + 1] = 255;
        pixels.data[i + 2] = 0
      }
    } else if (color === 'blue') {
      if (pixels.data[i + 2] > T_blue) {
        pixels.data[i] = 0
        pixels.data[i + 1] = 0;
        pixels.data[i + 2] = 255;
      }
    }
  }

  return pixels;
}

function drawThreshold() {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = toGrayScale(pixels);
  pixels = thresholdSeg(pixels);
  ctx.putImageData(pixels, 0, 0);
}

function drawAdaptiveThreshold() {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = toGrayScale(pixels);
  pixels = adaptiveThreshold(pixels);
  ctx.putImageData(pixels, 0, 0);
}

function drawColorT(color, T) {
  let pixeli = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixeli = colorThreshold(pixeli, color, T);
  ctx.putImageData(pixeli, 0, 0);
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } :
    null;
}


function getAdaptiveTGrayscale(ctx, x, y, w, h) {
  let pixels = ctx.getImageData(x, y, w, h);
  let T = 130;
  let G1 = [];
  let G2 = [];
  let m1, m2;
  let previousThreshold = 0;
  let n = 0;

  while (previousThreshold != T) {
    if (n > 15) break;
    n++;
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i] > T) {
        G1.push(pixels.data[i]);
      } else {
        G2.push(pixels.data[i]);
      }
    }

    m1 = getMeanValue(G1) || 0;
    m2 = getMeanValue(G2) || 0;
    previousThreshold = T;
    T = Math.floor((m1 + m2) / 2);
    G1 = [];
    G2 = [];
  }

  return T;
}

// T bazat pe media aritmetică a valorilor de gri dintr-o regiune
function meanNeighbor(pixels, C) {
  let sum = 0;
  for (let i = 0; i < pixels.data.length; i += 4) {
    sum += pixels.data[i];
  }

  return Math.floor(sum / (pixels.data.length / 4) - C);
}

// aplica T pe o regiune
function thrRegion(pixels, T, x, y) {
  //let tmpPx = [];
  for (let i = 0; i < pixels.data.length; i += 4) {
    if (pixels.data[i] > T) {
      pixels.data[i] = higherColor.r;
      pixels.data[i + 1] = higherColor.g;
      pixels.data[i + 2] = higherColor.b;
    } else {
      pixels.data[i] = lowerColor.r;
      pixels.data[i + 1] = lowerColor.g;
      pixels.data[i + 2] = lowerColor.b;
    }
  }
  ctx.putImageData(pixels, x, y);
}

function drawLocalTh(regionSize, C) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = toGrayScale(pixels);


  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const T = meanNeighbor(ctx.getImageData(x * regionSize, y * regionSize, regionSize, regionSize), C);
      thrRegion(ctx.getImageData(x * regionSize, y * regionSize, regionSize, regionSize), T, x * regionSize, y * regionSize);
    }
  }
}

function otsu(histData /* Array of 256 greyscale values */ , total /* Total number of pixels */ ) {
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * histData[t];

  let sumB = 0;
  let wB = 0;
  let wF = 0;

  let varMax = 0;
  let threshold = 0;

  for (let t = 0; t < 256; t++) {
    wB += histData[t]; // Weight Background
    if (wB == 0) continue;

    wF = total - wB; // Weight Foreground
    if (wF == 0) break;

    sumB += t * histData[t];

    let mB = sumB / wB; // Mean Background
    let mF = (sum - sumB) / wF; // Mean Foreground

    // Calculate Between Class Variance
    let varBetween = wB * wF * (mB - mF) * (mB - mF);

    // Check if new maximum found
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = t;
    }
  }

  return threshold;
}

function generateHistogram() {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = toGrayScale(pixels);
  let h = new Array(pixels.data.length / 4).fill(0);

  for (let i = 0; i < pixels.data.length; i += 4) {
    h[pixels.data[i]]++;
  }

  return h;
}