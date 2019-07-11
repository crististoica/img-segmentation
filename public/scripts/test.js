function regionGrowth(pixels) {
  const T = 225;
  const x = Math.floor(Math.random() * canvas.width);
  const y = Math.floor(Math.random() * canvas.height);
  const seed = ctx.getImageData(x, y, 1, 1).data;

  for (let i = 0; i < pixels.data.length; i += 4) {
    const R2 = pixels.data[i];
    const G2 = pixels.data[i + 1];
    const B2 = pixels.data[i + 2];
    const p2 = [R2, G2, B2];

    const d = getEuclideanDistance2(seed, p2);
    if (d > T) {
      pixels.data[i] = 255;
      pixels.data[i + 1] = 255;
      pixels.data[i + 2] = 255;
    } else {
      pixels.data[i] = 0;
      pixels.data[i + 1] = 0;
      pixels.data[i + 2] = 0;
    }
  }
  return pixels;
}

function getEuclideanDistance2(p1, p2) {
  const [R1, G1, B1] = p1;
  const [R2, G2, B2] = p2;

  return Math.sqrt((R1 - R2) ** 2 + (G1 - G2) ** 2 + (B1 - B2) ** 2);
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

function drawThresholdIt() {
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //pixels = toGrayScale(pixels);
  pixels = regionGrowth(pixels);
  ctx.putImageData(pixels, 0, 0);
}