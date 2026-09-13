(function () {
  'use strict';
  var dialog = document.getElementById('room-lightbox');
  var links = Array.from(document.querySelectorAll('[data-room-photo]'));
  if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;
  var host = document.getElementById('room-lightbox-image');
  var caption = document.getElementById('room-lightbox-caption');
  var index = 0;
  var opener;
  function showPhoto(next) {
    index = (next + links.length) % links.length;
    var link = links[index];
    var thumbnail = link.querySelector('img');
    var photo = new Image();
    photo.alt = thumbnail.alt;
    photo.width = thumbnail.width;
    photo.height = thumbnail.height;
    photo.src = link.href;
    host.replaceChildren(photo);
    caption.textContent = (index + 1) + ' / ' + links.length + ' — ' + link.dataset.caption;
  }
  links.forEach(function (link, position) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      showPhoto(position);
      dialog.showModal();
      document.body.classList.add('room-gallery-open');
    });
  });
  dialog.querySelector('.room-lightbox-close').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('.room-photo-prev').addEventListener('click', function () { showPhoto(index - 1); });
  dialog.querySelector('.room-photo-next').addEventListener('click', function () { showPhoto(index + 1); });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', function () {
    document.body.classList.remove('room-gallery-open');
    host.replaceChildren();
    if (opener) opener.focus({preventScroll: true});
  });
}());
