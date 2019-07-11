const filters = document.querySelector('#filters');
const applyEdge = document.querySelector('#apply-edge-detection');
const edgeDetecTitle = document.querySelector('#edge-detection-title');
const edgeColor = document.querySelector('#edge-color');
const applyEdgeColor = document.querySelector('#apply-edge-color');

let colorForEdge = hexToRgb(edgeColor.value);

applyEdgeColor.addEventListener('click', () => {
  drawColoredEdges(colorForEdge);
});

edgeColor.addEventListener('change', () => {
  colorForEdge = hexToRgb(edgeColor.value);
});

const operators = {
  sobel: {
    GX: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
    GY: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ]
  },
  laplacian: {
    GX: [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0]
    ],
    GY: [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0]
    ]
  },
  prewitt: {
    GX: [
      [1, 1, 1],
      [0, 0, 0],
      [-1, -1, -1]
    ],
    GY: [
      [1, 0, -1],
      [1, 0, -1],
      [1, 0, -1]
    ]
  },
  sobelfeldman: {
    GX: [
      [3, 0, -3],
      [10, 0, -10],
      [3, 0, -3]
    ],
    GY: [
      [3, 10, 3],
      [0, 0, 0],
      [-3, -10, -3]
    ]
  },
  scharr: {
    GX: [
      [47, 0, -47],
      [162, 0, -162],
      [47, 0, -47]
    ],
    GY: [
      [47, 162, 47],
      [0, 0, 0],
      [-47, -162, -47]
    ]
  }
};

let GX = operators.sobel.GX;
let GY = operators.sobel.GY;

filters.addEventListener('change', () => {
  const filter = filters.value;
  GX = operators[filter].GX;
  GY = operators[filter].GY;
});

applyEdge.addEventListener('click', () => {
  edgeDetection();
  TITLE = edgeDetecTitle.textContent + ' - ' + filters.value.toString().toUpperCase();
});

function edgeDetection() {

  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = toGrayScale(pixels);
  //pixels = gaussianBlur(pixels);
  //pixels = reduceNoise(pixels);

  let tmPx = new Uint8ClampedArray(pixels.data.length);
  tmPx.set(pixels.data);

  for (let i = 0; i < tmPx.length - 8; i += 4) {
    // const pxValueX = (
    //   GX[0][0] * tmPx[i] +
    //   GX[0][1] * tmPx[i + 4] +
    //   GX[0][2] * tmPx[i + 8] +
    //   GX[1][0] * tmPx[i + (4 * canvas.width) + 0] +
    //   GX[1][1] * tmPx[i + (4 * canvas.width) + 4] +
    //   GX[1][2] * tmPx[i + (4 * canvas.width) + 8] +
    //   GX[2][0] * tmPx[i + (8 * canvas.width) + 0] +
    //   GX[2][1] * tmPx[i + (8 * canvas.width) + 4] +
    //   GX[2][2] * tmPx[i + (8 * canvas.width) + 8]
    // );

    // const pxValueY = (
    //   GY[0][0] * tmPx[i] +
    //   GY[0][1] * tmPx[i + 4] +
    //   GY[0][2] * tmPx[i + 8] +
    //   GY[1][0] * tmPx[i + (4 * canvas.width) + 0] +
    //   GY[1][1] * tmPx[i + (4 * canvas.width) + 4] +
    //   GY[1][2] * tmPx[i + (4 * canvas.width) + 8] +
    //   GY[2][0] * tmPx[i + (8 * canvas.width) + 0] +
    //   GY[2][1] * tmPx[i + (8 * canvas.width) + 4] +
    //   GY[2][2] * tmPx[i + (8 * canvas.width) + 8]
    // );

    const pxValueX = (
      GX[0][0] * tmPx[i - (4 * canvas.width) - 4] +
      GX[0][1] * tmPx[i - (4 * canvas.width) - 0] +
      GX[0][2] * tmPx[i - (4 * canvas.width) + 4] +
      GX[1][0] * tmPx[i - 4] +
      GX[1][1] * tmPx[i] +
      GX[1][2] * tmPx[i + 4] +
      GX[2][0] * tmPx[i + (4 * canvas.width) - 4] +
      GX[2][1] * tmPx[i + (4 * canvas.width)] +
      GX[2][2] * tmPx[i + (4 * canvas.width) + 4]
    );

    const pxValueY = (
      GY[0][0] * tmPx[i - (4 * canvas.width) - 4] +
      GY[0][1] * tmPx[i - (4 * canvas.width) - 0] +
      GY[0][2] * tmPx[i - (4 * canvas.width) + 4] +
      GY[1][0] * tmPx[i - 4] +
      GY[1][1] * tmPx[i] +
      GY[1][2] * tmPx[i + 4] +
      GY[2][0] * tmPx[i + (4 * canvas.width) - 4] +
      GY[2][1] * tmPx[i + (4 * canvas.width)] +
      GY[2][2] * tmPx[i + (4 * canvas.width) + 4]
    );

    const pxValue = Math.sqrt(pxValueX ** 2 + pxValueY ** 2) >>> 0;

    pixels.data[i] = pxValue;
    pixels.data[i + 1] = pxValue;
    pixels.data[i + 2] = pxValue;
  }

  ctx.putImageData(pixels, 0, 0);
}

// GRAYSCALE
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


function gaussianBlur(pixels) {

  let px = pixels.data;
  let tmpPx = new Uint8ClampedArray(px.length);
  tmpPx.set(px);

  for (let i = 0, len = px.length; i < len; i++) {
    if (i % 4 === 3) { continue; }

    px[i] = (tmpPx[i] +
      (tmpPx[i - 4] || tmpPx[i]) +
      (tmpPx[i + 4] || tmpPx[i]) +
      (tmpPx[i - 4 * canvas.width] || tmpPx[i]) +
      (tmpPx[i + 4 * canvas.width] || tmpPx[i]) +
      (tmpPx[i - 4 * canvas.width - 4] || tmpPx[i]) +
      (tmpPx[i + 4 * canvas.width + 4] || tmpPx[i]) +
      (tmpPx[i + 4 * canvas.width - 4] || tmpPx[i]) +
      (tmpPx[i - 4 * canvas.width + 4] || tmpPx[i])
    ) / 9;
  };
  pixels.data = px;

  return pixels;
}

function reduceNoise(pixels) {
  //let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const K = [
    [1, 4, 7, 4, 1],
    [4, 16, 26, 16, 4],
    [7, 26, 41, 26, 7],
    [4, 16, 26, 16, 4],
    [1, 4, 7, 4, 1]
  ];

  let px = pixels.data;
  let tmpPx = new Uint8ClampedArray(px.length);
  tmpPx.set(px);

  for (let i = 0; i < px.length; i++) {
    if (i % 4 == 3) { continue; }
    px[i] = (
      K[0][0] * tmpPx[i] +
      K[0][1] * tmpPx[i + 4] +
      K[0][2] * tmpPx[i + 8] +
      K[0][3] * tmpPx[i + 12] +
      K[0][4] * tmpPx[i + 16] +
      K[1][0] * tmpPx[i + (4 * canvas.width)] +
      K[1][1] * tmpPx[i + (4 * canvas.width) + 4] +
      K[1][2] * tmpPx[i + (4 * canvas.width) + 8] +
      K[1][3] * tmpPx[i + (4 * canvas.width) + 12] +
      K[1][4] * tmpPx[i + (4 * canvas.width) + 16] +
      K[2][0] * tmpPx[i + (8 * canvas.width)] +
      K[2][1] * tmpPx[i + (8 * canvas.width) + 4] +
      K[2][2] * tmpPx[i + (8 * canvas.width) + 8] +
      K[2][3] * tmpPx[i + (8 * canvas.width) + 12] +
      K[2][4] * tmpPx[i + (8 * canvas.width) + 16] +
      K[3][0] * tmpPx[i + (12 * canvas.width)] +
      K[3][1] * tmpPx[i + (12 * canvas.width) + 4] +
      K[3][2] * tmpPx[i + (12 * canvas.width) + 8] +
      K[3][3] * tmpPx[i + (12 * canvas.width) + 12] +
      K[3][4] * tmpPx[i + (12 * canvas.width) + 16] +
      K[4][0] * tmpPx[i + (16 * canvas.width)] +
      K[4][1] * tmpPx[i + (16 * canvas.width) + 4] +
      K[4][2] * tmpPx[i + (16 * canvas.width) + 8] +
      K[4][3] * tmpPx[i + (16 * canvas.width) + 12] +
      K[4][4] * tmpPx[i + (16 * canvas.width) + 16]
    ) / 273;
  }
  pixels.data = [...px];
  return pixels;
}

// colorare margini
function colorEdges(pixels, C) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    if (pixels.data[i] > 90) {
      pixels.data[i] = C.r;
      pixels.data[i + 1] = C.g;
      pixels.data[i + 2] = C.b;
    } else {
      pixels.data[i] = 0;
      pixels.data[i + 1] = 0;
      pixels.data[i + 2] = 0;
    }
  }

  return pixels;
}

function drawColoredEdges(C) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = colorEdges(pixels, C);
  ctx.putImageData(pixels, 0, 0);
}