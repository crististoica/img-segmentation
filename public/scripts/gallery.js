const goToGallery = document.querySelector('#goto-gallery');
const goToMain = document.querySelector('#goto-main');
const mainDiv = document.querySelector('#main');
const gallery = document.querySelector('#gallery');
const addToGallery = document.querySelector('#add-to-gallery');
const imageGallery = document.querySelector('#image-gallery');
const clearGalleryBtn = document.querySelector('#clear-gallery');

let galleryImages = null;
let currentImg = null;

//const galleryItems = [];

// ascundem containerul principal si afisam containerul care contine galeria
goToGallery.addEventListener('click', () => {
  mainDiv.style.display = 'none';
  gallery.style.display = 'block';
  galleryImages = imageGallery.querySelectorAll('div>img');

  galleryImages.forEach(img => {

    img.addEventListener('click', (e) => {
      currentImg = e.target;
      currentImg.style.border = '2px solid green';

      let currentSrc = currentImg.src;

      currentImg.parentElement.querySelectorAll('button').forEach(button => {
        button.style.display = 'inline';
        // adaugam un event pe butonul cu textul 'Remove'
        if (button.textContent == 'Șterge') {
          button.addEventListener('click', () => {
            button.parentElement.style.display = 'none';
          });
          // adaugam un event pe butonul cu textul 'Save'
        } else if (button.textContent == 'Salvează') {
          button.addEventListener('click', () => {
            // luam continutul headerului pentru a seta numele imaginii pe care o salvam
            const title = button.parentElement.querySelector('h3').textContent;
            // cream un link
            const a = document.createElement('a');
            a.href = currentSrc;
            a.download = title;
            // la apasarea butonului 'Save' se va apasa si linkul
            // apasarea linkului declanseaza functia de salvare a browserului
            a.click();
          });

        }
      });

      galleryImages.forEach(img => {
        // setam display = 'none' pentru toate butoanele care nu apartin imaginii curente(pe care am dat click)
        if (img != currentImg) {
          img.style.border = 'none';
          img.parentElement.querySelectorAll('button').forEach(button => {
            button.style.display = 'none';
          });
        }
      });
    });
  });

});

// ascundem containerul care contine galeria si afisam containerul principal
goToMain.addEventListener('click', () => {
  mainDiv.style.display = 'flex';
  gallery.style.display = 'none';
});


// butonul 'ADD TO GALLERY'
addToGallery.addEventListener('click', () => {
  // cream un div, img, h3 si doua butoane
  const container = document.createElement('div');
  const image = new Image();
  const h3 = document.createElement('h3');
  const dwnBtn = document.createElement('button');
  const rmvBtn = document.createElement('button');

  dwnBtn.textContent = 'Salvează';
  rmvBtn.textContent = 'Șterge';

  dwnBtn.style.display = 'none';
  rmvBtn.style.display = 'none';
  dwnBtn.classList.add('gallery-img-button');
  rmvBtn.classList.add('gallery-img-button');

  image.src = canvas.toDataURL();
  h3.textContent = TITLE;
  // adaugam img, h3 si cele doua butoane in div
  container.appendChild(h3);
  container.appendChild(image);
  container.appendChild(dwnBtn);
  container.appendChild(rmvBtn);
  // in containerul care contine galeria, adaugam div-ul creat mai sus
  imageGallery.appendChild(container);
});

// butonul care elimina continutul galeriei
clearGalleryBtn.addEventListener('click', () => {
  imageGallery.textContent = '';
});