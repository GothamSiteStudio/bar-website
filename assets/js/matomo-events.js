/* Matomo lead-event tracking - shared snippet, all Gotham Site Studio sites.
   Loaded on every page that carries the Matomo tracker. Fires the event
   actions that the "Phone Call" and "Form Submit" goals match on.
   Convention: category "Contact", actions phone_click | form_submit |
   whatsapp_click | email_click. */
(function () {
  /* Always read window._paq at call time: matomo.js swaps the queue array
     for its tracker proxy once it loads, and a captured reference would
     silently drop every event fired after that. */
  function track(action, name) {
    var q = (window._paq = window._paq || []);
    q.push(['trackEvent', 'Contact', action, name || location.pathname]);
  }

  function closest(el, sel) {
    return el && el.closest ? el.closest(sel) : null;
  }

  document.addEventListener(
    'click',
    function (e) {
      var t = e.target;

      var tel = closest(t, 'a[href^="tel:"]');
      if (tel) return track('phone_click', tel.getAttribute('href').slice(4));

      var wa = closest(t, 'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="whatsapp://"]');
      if (wa) return track('whatsapp_click', location.pathname);

      var mail = closest(t, 'a[href^="mailto:"]');
      if (mail) return track('email_click', mail.getAttribute('href').slice(7));
    },
    true
  );

  document.addEventListener(
    'submit',
    function (e) {
      var f = e.target;
      if (f && f.tagName === 'FORM') {
        track('form_submit', f.getAttribute('name') || f.id || location.pathname);
      }
    },
    true
  );

  /* Worker-based forms 303-redirect to a thank-you page, so there is no
     submit event to catch on the destination. Count the landing instead. */
  var path = location.pathname;
  try {
    path = decodeURIComponent(path);
  } catch (err) {}
  if (/thank[-_ ]?you|todah|\u05ea\u05d5\u05d3\u05d4/i.test(path)) {
    track('form_submit', 'thank-you:' + location.pathname);
  }
})();
