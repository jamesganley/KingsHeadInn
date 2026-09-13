(function () {
  'use strict';
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  function closeMenu() { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
  });
  document.addEventListener('click', function (event) { if (!event.target.closest('.site-header')) closeMenu(); });
  nav.addEventListener('click', function (event) { if (event.target.closest('a')) closeMenu(); });
  document.querySelector('.site-header').classList.add('nav-ready');
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var form = document.getElementById('stay-form');
  if (!form) return;
  function localISO(date) { return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0'); }
  var arrival = form.elements.arrival, departure = form.elements.departure;
  arrival.min = localISO(new Date());
  function updateDates() {
    arrival.min = localISO(new Date());
    var next = new Date((arrival.value || arrival.min) + 'T12:00:00');
    next.setDate(next.getDate() + 1);
    departure.min = localISO(next);
    departure.setCustomValidity(departure.value && departure.value <= arrival.value ? 'Departure must be after arrival.' : '');
  }
  arrival.addEventListener('change', updateDates);
  departure.addEventListener('change', updateDates);
  updateDates();

  var submit = document.getElementById('send-enquiry');
  var status = document.getElementById('enquiry-status');
  var endpoint = form.dataset.submitUrl;
  var buttonLabel = submit.innerHTML;
  var sending = false;
  submit.type = 'submit';

  function showFailure() {
    status.setAttribute('role', 'alert');
    status.className = 'form-status small-note is-error';
    status.innerHTML = 'Sorry, we could not send your enquiry. Please email <a href="mailto:kingsheadinnbookings@gmail.com">kingsheadinnbookings@gmail.com</a> or call <a href="tel:01403782012">01403 782012</a>.';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (sending) return;
    updateDates();
    if (!form.reportValidity()) return;

    if (!window.fetch || !window.AbortController || !/^https?:$/.test(window.location.protocol)) {
      showFailure();
      return;
    }

    var fields = {};
    new FormData(form).forEach(function (value, key) { fields[key] = value; });
    fields._replyto = fields.email;
    var controller = new AbortController();
    var timeout = window.setTimeout(function () { controller.abort(); }, 12000);

    sending = true;
    form.setAttribute('aria-busy', 'true');
    submit.disabled = true;
    submit.textContent = 'Sending enquiry…';
    status.setAttribute('role', 'status');
    status.className = 'form-status small-note is-sending';
    status.textContent = 'Sending your enquiry securely. Please wait.';

    fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(fields),
      signal: controller.signal
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok || !data || (data.success !== true && data.success !== 'true')) throw new Error('Submission rejected');
        return data;
      });
    }).then(function () {
      status.setAttribute('role', 'status');
      status.className = 'form-status small-note is-success';
      status.textContent = 'Thank you — your enquiry has been submitted. Your room is not yet reserved; our team will be in touch about availability and rates.';
      form.reset();
      updateDates();
    }).catch(function () {
      showFailure();
    }).finally(function () {
      window.clearTimeout(timeout);
      sending = false;
      form.setAttribute('aria-busy', 'false');
      submit.disabled = false;
      submit.innerHTML = buttonLabel;
    });
  });
}());
