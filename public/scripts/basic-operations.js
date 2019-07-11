const applyInvertColors = document.querySelector('#apply-invert');
const contrastValue = document.querySelector('#contrast-value');
const cValue = document.querySelector('#contrast-label');

const brightnessValue = document.querySelector('#luminozitate-value');
const bValue = document.querySelector('#luminozitate-label');

const btnBlur_x1 = document.querySelector('#aplly-blur-once');
const btnBlur_x10 = document.querySelector('#aplly-blur-ten-times');

const apllyGrayScale = document.querySelector('#aplly-grayscale');

const tSolarisation = document.querySelector('#t-solarisation-value');
const applySolarisation = document.querySelector('#apply-solarisation');
const applyAdaptiveSolarisation = document.querySelector('#apply-adaptive-t-solarisation');
const checkBoxSol = document.querySelector('#greater-than-t');

applySolarisation.addEventListener('click', (e) => {
  e.preventDefault();
  const t = tSolarisation.value;
  if (checkBoxSol.checked) {
    drawSolarisation(t || 125, true);
    TITLE = 'Solarizare ' + ' < ' + t;
  } else {
    drawSolarisation(t || 125, false);
    TITLE = 'Solarizare ' + ' > ' + t;
  }

});

applyAdaptiveSolarisation.addEventListener('click', (e) => {
  e.preventDefault();
  if (checkBoxSol.checked) {
    drawAdaptiveSolarisation(true);
    TITLE = 'Solarizarea adaptivă < T';
  } else {
    drawAdaptiveSolarisation(false);
    TITLE = 'Solarizarea adaptivă > T';
  }

});

apllyGrayScale.addEventListener('click', () => {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = toGrayScale(pixels);
  ctx.putImageData(pixels, 0, 0);
  TITLE = 'Grayscale';
});

btnBlur_x1.addEventListener('click', () => {
  drawBlur();
  TITLE = 'Blur';
});

btnBlur_x10.addEventListener('click', () => {
  for (let i = 0; i < 10; i++) {
    drawBlur();
  }
  TITLE = 'Blur';
});

contrastValue.addEventListener('change', () => {
  let C = contrastValue.value;
  drawContrast(parseInt(C));
  TITLE = 'Contrast ' + C;
});

contrastValue.addEventListener('input', () => {
  cValue.value = contrastValue.value;
});

brightnessValue.addEventListener('change', () => {
  let C = brightnessValue.value;
  drawBrightness(parseInt(C));
  TITLE = 'Luminozitate ' + C;
});

brightnessValue.addEventListener('input', () => {
  bValue.value = brightnessValue.value;
});

applyInvertColors.addEventListener('click', () => {
  drawInvertedColors();
  TITLE = 'Culori inversate';
});

function convert(pixels, f) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    const r = pixels.data[i];
    const g = pixels.data[i + 1];
    const b = pixels.data[i + 2];
    const color = {
      r: r,
      g: g,
      b: b
    };

    const convertedColor = f(color);
    pixels.data[i] = convertedColor.h * 255;
    pixels.data[i + 1] = convertedColor.s * 255;
    pixels.data[i + 2] = convertedColor.v * 255;
  }
  return pixels;
}

function invertColors(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] ^= 255;
    pixels.data[i + 1] ^= 255;
    pixels.data[i + 2] ^= 255;
  }

  return pixels;
}

function solarisation(pixels, t, checked) {
  if (checked) {
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i] < t) {
        pixels.data[i] ^= 255;
      }
      if (pixels.data[i + 1] < t) {
        pixels.data[i + 1] ^= 255;
      }
      if (pixels.data[i + 2] < t) {
        pixels.data[i + 2] ^= 255;
      }
    }
  } else {
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i] > t) {
        pixels.data[i] ^= 255;
      }
      if (pixels.data[i + 1] > t) {
        pixels.data[i + 1] ^= 255;
      }
      if (pixels.data[i + 2] > t) {
        pixels.data[i + 2] ^= 255;
      }
    }
  }

  return pixels;
}

function adaptiveSolarisation(pixels, checked) {
  let t = Math.random() * 255;
  let G1 = [];
  let G2 = [];
  let m1, m2;
  let previousThreshold = 0;
  let n = 0;

  while (previousThreshold != t) {
    if (n > 15) break;
    n++;
    for (let i = 0; i < pixels.data.length; i += 4) {
      const r = pixels.data[i];
      const g = pixels.data[i + 1];
      const b = pixels.data[i + 2];
      const color = {
        r: r,
        g: g,
        b: b
      }
      if (mean(color) > t) {
        G1.push(mean(color));
      } else {
        G2.push(mean(color));
      }
    }
    m1 = getMeanValue(G1);
    m2 = getMeanValue(G2);
    previousThreshold = t;
    t = Math.floor((m1 + m2) / 2);
    G1 = [];
    G2 = [];
  }

  if (checked) {
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i] < t) {
        pixels.data[i] ^= 255;
      }
      if (pixels.data[i + 1] < t) {
        pixels.data[i + 1] ^= 255;
      }
      if (pixels.data[i + 2] < t) {
        pixels.data[i + 2] ^= 255;
      }
    }
  } else {
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i] > t) {
        pixels.data[i] ^= 255;
      }
      if (pixels.data[i + 1] > t) {
        pixels.data[i + 1] ^= 255;
      }
      if (pixels.data[i + 2] > t) {
        pixels.data[i + 2] ^= 255;
      }
    }
  }
  return pixels;
}

function mean(color) {
  return (color.r + color.g + color.b) / 3;
}

// blur
function blur(pixels) {
  let px = pixels.data;
  let tmpPx = new Uint8ClampedArray(px.length);
  tmpPx = [...px];

  for (let i = 0; i < px.length; i++) {
    if (i % 4 == 3) { continue; }
    px[i] = (
      (tmpPx[i - (canvas.width * 4)] || tmpPx[i]) +
      (tmpPx[i - (canvas.width * 4) + 4] || tmpPx[i]) +
      (tmpPx[i - (canvas.width * 4) - 4] || tmpPx[i]) +
      (tmpPx[i - 4] || tmpPx[i]) +
      (tmpPx[i] || tmpPx[i]) +
      (tmpPx[i + 4] || tmpPx[i]) +
      (tmpPx[i + (canvas.width * 4) - 4] || tmpPx[i]) +
      (tmpPx[i + (canvas.width * 4)] || tmpPx[i]) +
      (tmpPx[i + (canvas.width * 4) + 4] || tmpPx[i])
    ) / 9;
  }

  pixels.data = [...px];
  return pixels;
}

// function gaussian blur
function gBlur(pixels) {
  let px = pixels.data;
  let tmpPx = new Uint8ClampedArray(px.length);
  tmpPx = [...px];

  const K = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
  ];
  // const K = [
  //   [0, -1, 0],
  //   [-1, 5, -1],
  //   [0, -1, 0]
  // ];

  for (let i = 0; i < px.length; i++) {
    if (i % 4 == 3) { continue; }
    px[i] = (
      K[0][0] * tmpPx[i - (4 * canvas.width) - 4] +
      K[0][1] * tmpPx[i - (4 * canvas.width) - 0] +
      K[0][2] * tmpPx[i - (4 * canvas.width) + 4] +
      K[1][0] * tmpPx[i - 4] +
      K[1][1] * tmpPx[i] +
      K[1][2] * tmpPx[i + 4] +
      K[2][0] * tmpPx[i + (4 * canvas.width) - 4] +
      K[2][1] * tmpPx[i + (4 * canvas.width)] +
      K[2][2] * tmpPx[i + (4 * canvas.width) + 4]
    ) / 16;
  }

  pixels.data = [...px];
  return pixels;
}

function contrast(pixels, C) {

  const F = (259 * (C + 255)) / (255 * (259 - C));

  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = F * (pixels.data[i] - 128) + 128;
    pixels.data[i + 1] = F * (pixels.data[i + 1] - 128) + 128;
    pixels.data[i + 2] = F * (pixels.data[i + 2] - 128) + 128;
  }

  return pixels;
}

function applyBrightness(pixels, brightness) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    // pixels.data[i] += 255 * (brightness / 100);
    // pixels.data[i + 1] += 255 * (brightness / 100);
    // pixels.data[i + 2] += 255 * (brightness / 100);
    pixels.data[i] += brightness;
    pixels.data[i + 1] += brightness;
    pixels.data[i + 2] += brightness;
  }

  return pixels;
}

function drawConversion(f) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = convert(pixels, f);
  ctx.putImageData(pixels, 0, 0);
}

// contrast
function drawContrast(C) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = contrast(pixels, C);
  ctx.putImageData(pixels, 0, 0);
}
// blur
function drawBlur() {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = gBlur(pixels);
  ctx.putImageData(pixels, 0, 0);
}

// brightness
function drawBrightness(C) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = applyBrightness(pixels, C);
  ctx.putImageData(pixels, 0, 0);
}

// invereted colors
function drawInvertedColors() {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = invertColors(pixels);
  ctx.putImageData(pixels, 0, 0);
}

// solarisation
function drawSolarisation(t, checked) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = solarisation(pixels, t, checked);
  ctx.putImageData(pixels, 0, 0);
}

// adaptive solarisation
function drawAdaptiveSolarisation(checked) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = adaptiveSolarisation(pixels, checked);
  ctx.putImageData(pixels, 0, 0);
}