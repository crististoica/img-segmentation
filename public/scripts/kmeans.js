const applyKMeans = document.querySelector('#apply-kmeans');
const KValue = document.querySelector('#k-value');
const KMeansTitle = document.querySelector('#kmeans-title');

const chooseManually = document.querySelector('#kmeans-manual');
const manualDiv = document.querySelector('#manual-kmeans');
const applyManual = document.querySelector('#aplly-manual');
const chooseAgain = document.querySelector('#choose-again');
const backToMain = document.querySelector('#return-to-main');
const manualCanvas = document.querySelector('#manual-canvas');
const manualCtx = manualCanvas.getContext('2d');
const manualCentroids = document.querySelector('#centroids');
const save = document.querySelector('#save');


let K = KValue.value;
let n = 0;
let i = 0;
let manualCenters = [];

KValue.addEventListener('change', () => {
  K = KValue.value;
});

chooseAgain.addEventListener('click', () => {
  manualCenters = [];
  manualCentroids.textContent = '';
  img.src = img.src;
  manualCtx.drawImage(img, 0, 0);
  i = 0;
  n = 0;
});

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


manualCanvas.addEventListener('click', (e) => {

  if (n < K) {
    const x = getMousePos(manualCanvas, e).x;
    const y = getMousePos(manualCanvas, e).y;
    const c = manualCtx.getImageData(x, y, 1, 1).data;
    manualCenters.push({ index: i, data: c });


    const color = rgbToHex(c[0], c[1], c[2]);

    const inp = document.createElement('input');
    inp.setAttribute('type', 'color');
    inp.setAttribute('value', color);
    manualCentroids.appendChild(inp);

    i++;
    n++;
  }
});

applyManual.addEventListener('click', () => {
  drawKMEANSManual(manualCenters);
});


chooseManually.addEventListener('click', () => {
  mainDiv.style.display = 'none';
  manualDiv.style.display = 'block';
  manualCentroids.textContent = '';

  const img = new Image();
  img.src = canvas.toDataURL();
  img.addEventListener('load', () => {
    manualCanvas.width = img.width;
    manualCanvas.height = img.height;
    manualCtx.drawImage(img, 0, 0);
  });
});

save.addEventListener('click', () => {
  const img = new Image();
  img.src = manualCanvas.toDataURL();
  img.addEventListener('load', () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  });
  TITLE = 'Centroizi aleși manual'
});

backToMain.addEventListener('click', () => {
  mainDiv.style.display = 'flex';
  manualDiv.style.display = 'none';
  manualCenters = [];
  i = 0;
  n = 0;
});

// la apasarea butonului "Apply KMeans" se va executa functia drawKMEANS()
applyKMeans.addEventListener('click', () => {
  drawKMEANS(K);
  TITLE = KMeansTitle.textContent + ' ' + KValue.value.toString();
});

// returnează poziția cursorului de la mouse
function getMousePos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return {
    // rect.left = distanța dintre marginea ferestrei principale și partea stângă a canvasului
    x: e.clientX - rect.left,
    // rect.left = distanța dintre partea de sus a ferestrei principale și partea de sus a canvasului
    y: e.clientY - rect.top // rect.top = originea canvasului (y)
  };
}


// GET K CENTROIDS
function getCenters(k) {
  const centers = [];

  for (let i = 0; i < k; i++) {
    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);
    const pixel = ctx.getImageData(x, y, 1, 1);

    centers.push({ index: i, data: pixel.data });
  }

  return centers;
}

// EUCLIDEAN DISTANCE
function getEuclideanDistance(p1, p2) {
  const [R1, G1, B1] = p1;
  const [R2, G2, B2] = p2;

  return Math.sqrt((R1 - R2) ** 2 + (G1 - G2) ** 2 + (B1 - B2) ** 2);
}

// GET MINIMUM DISTANCE BETWEEN ONE PIXEL AND THE K CENTROIDS
function getMinimumCenter(p, centroids) {
  let minim = centroids[0];
  for (let i = 1; i < centroids.length; i++) {
    if (getEuclideanDistance(p, centroids[i].data) < getEuclideanDistance(p, minim.data)) {
      minim = centroids[i];
    }
  }

  return minim;
}

// MAIN FUNCTION
function KMEANS(pixels, K, manual) {
  let centers = null;
  if (!manual) {
    centers = getCenters(K);
  } else if (manual) {
    centers = manual;
  }

  const clusters = [];
  for (let i = 0; i < centers.length; i++) {
    clusters[i] = [];
  }

  // FORM CLUSTERS
  for (let i = 0; i < pixels.data.length; i += 4) {
    const R = pixels.data[i];
    const G = pixels.data[i + 1];
    const B = pixels.data[i + 2];
    const pixel = [R, G, B];

    const center = getMinimumCenter(pixel, centers);
    const index = center.index;
    clusters[index].push(pixel);
    pixels.data[i] = center.data[0];
    pixels.data[i + 1] = center.data[1];
    pixels.data[i + 2] = center.data[2];
  }

  let finalClusters = [...clusters];
  let n = 5;
  while (n != 0) {
    for (let i = 0; i < clusters.length; i++) {
      centers[i] = getNewCentroid(finalClusters[i], i);
    }

    for (let i = 0; i < pixels.data.length; i += 4) {
      const R = pixels.data[i];
      const G = pixels.data[i + 1];
      const B = pixels.data[i + 2];
      const pixel = [R, G, B];

      const center = getMinimumCenter(pixel, centers);
      const index = center.index;
      clusters[index].push(pixel);

      pixels.data[i] = center.data[0];
      pixels.data[i + 1] = center.data[1];
      pixels.data[i + 2] = center.data[2];
    }
    finalClusters = [...clusters];
    for (let i = 0; i < centers.length; i++) {
      clusters[i] = [];
    }
    n--;
  }
  console.log('DONE !');

  return pixels;
}

function getNewCentroid(cluster, index) {
  const centroid = { index: index, data: null };
  const pixel = [];

  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;

  let redCount = 0;
  let greenCount = 0;
  let blueCount = 0;

  for (let i = 0; i < cluster.length; i++) {
    totalRed += cluster[i][0];
    redCount++;
    totalGreen += cluster[i][1];
    greenCount++;
    totalBlue += cluster[i][2];
    blueCount++;
  }

  pixel.push(Math.floor(totalRed / redCount));
  pixel.push(Math.floor(totalGreen / greenCount));
  pixel.push(Math.floor(totalBlue / blueCount));

  centroid.data = pixel;
  return centroid;
}

function getMaximumCenter(p, centroids) {
  let minim = centroids[0];
  const size = centroids.length;
  for (let i = 1; i < centroids.length; i++) {
    if (getEuclideanDistance(p, centroids[i].data) < getEuclideanDistance(p, minim.data)) {
      minim = centroids[i];
    }
  }

  for (let i = 0; i < centroids[size - 1].data; i++) {
    if (centroids[size - 1].data != minim.data[i]) return false;
  }
  return true;
}


function drawKMEANS(K) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = KMEANS(pixels, K);
  ctx.putImageData(pixels, 0, 0);
}

function drawKMEANSManual(manual) {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixels = KMEANS(pixels, undefined, manual);
  manualCtx.putImageData(pixels, 0, 0);
}