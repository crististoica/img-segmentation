const canvas = document.querySelector('#canvas');
const acc = Array.from(document.querySelectorAll('.accordion'));
const images = document.querySelector('#img-select');
const resetButtons = Array.from(document.querySelectorAll('.reset'));
const FORCE_RESET = document.querySelector('#force-reset');
const uploadFile = document.querySelector('#upload-file');
const addImage = document.querySelector('#add-image');
const saveFile = document.querySelector('#save-image');

// img title for gallery
let TITLE = 'Imagine Originală';
let fileName = '';

const ctx = canvas.getContext('2d');
let img = new Image();
img.src = images[0].value;

img.addEventListener('load', () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
});
// change img src
images.addEventListener('change', () => {
  img.src = images.value;
});

// handle reset buttons
const tempSrc = canvas.toDataURL();
resetButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    //img.src = images.value;
    img.src = img.src;
    TITLE = 'Original Image';
    i = 0;
    n = 0;
  });
});

function collapse() {
  acc.forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('active');
      const panel = el.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

FORCE_RESET.addEventListener('click', (e) => {
  e.preventDefault();
  img.src = images.value;
});

// click pe butonul de adaugare image => click pe "adaugare fisier"
addImage.addEventListener('click', () => {
  uploadFile.click();
});

uploadFile.addEventListener('change', () => {

  const file = uploadFile.files[0];
  const reader = new FileReader();

  if (file) {
    fileName = file.name;
    reader.readAsDataURL(file);
  }

  reader.addEventListener('load', () => {
    imgSrc = reader.result;
    img.src = imgSrc;
  });
});


saveFile.addEventListener('click', () => {
  download(canvas, TITLE);
});

function download(canvas, filename) {
  const link = document.createElement('a');
  let e = null;

  link.download = filename;
  link.href = canvas.toDataURL('image/png;base64');

  if (document.createEvent) {
    e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);

    link.dispatchEvent(e);
  } else if (link.fireEvent) {
    link.fireEvent('onclick');
  }
}

// collapse alg menu
collapse();