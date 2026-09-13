(function () {
  'use strict';
  var list = document.getElementById('sports-schedule-list');
  if (!list) return;
  list.setAttribute('aria-busy', 'true');
  list.textContent = 'Loading upcoming fixtures…';
  var status = document.getElementById('fixture-status');
  var leagues = [{ id: '4328', sport: 'Football' }, { id: '4480', sport: 'Football' }, { id: '4414', sport: 'Rugby' }, { id: '4370', sport: 'Motorsport' }];
  var fixtures = [], filter = 'all', loaded = false, failed = 0;
  var cacheKey = 'kings-head-fixtures-v3';
  function dateFor(event) {
    var date = event.dateEvent;
    var stamp = event.strTimestamp;
    if (!stamp && date) stamp = date + 'T' + (event.strTime || '00:00:00');
    if (!stamp) return new Date(NaN);
    if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(stamp)) stamp += 'Z';
    return new Date(stamp);
  }
  function valid(item) {
    if (!item || !item.event || typeof item.event.strEvent !== 'string' || !['Football','Rugby','Motorsport'].includes(item.sport)) return false;
    var date = dateFor(item.event);
    return Number.isFinite(date.getTime()) && date >= new Date() && !['FT','Finished','Cancelled','Postponed'].includes(item.event.strStatus) && item.event.strPostponed !== 'yes';
  }
  function escape(value) { var el = document.createElement('span'); el.textContent = value || ''; return el.innerHTML; }
  function render() {
    if (!loaded) return;
    fixtures = fixtures.filter(valid);
    var selected = fixtures.filter(function (f) { return filter === 'all' || f.sport === filter; });
    if (!selected.length) {
      list.innerHTML = '<p class="feed-message">' + (failed === leagues.length ? 'The fixture service is currently unavailable.' : 'No upcoming ' + (filter === 'all' ? '' : filter.toLowerCase() + ' ') + 'fixtures are available in this feed.') + ' <a href="tel:01403782012">Call 01403 782012</a> to ask what we’re showing.</p>';
    } else {
      list.innerHTML = selected.map(function (item) {
        var date = dateFor(item.event);
        var day = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/London' }).format(date);
        var hasTime = Boolean(item.event.strTimestamp || item.event.strTime);
        var time = hasTime ? new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/London' }).format(date) : 'TBC';
        return '<article class="sports-fixture"><time class="sports-fixture-date" datetime="' + date.toISOString() + '">' + escape(day) + '<strong>' + time + '</strong></time><div><span class="sports-fixture-league">' + escape(item.event.strLeague) + '</span><h3 class="sports-fixture-name">' + escape(item.event.strEvent) + '</h3></div><span class="sports-fixture-sport">' + item.sport + '</span></article>';
      }).join('');
    }
    list.setAttribute('aria-busy', 'false');
  }
  document.querySelectorAll('.sports-filter-button').forEach(function (button) {
    button.addEventListener('click', function () {
      filter = button.dataset.sportFilter;
      document.querySelectorAll('.sports-filter-button').forEach(function (b) { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
      render();
    });
  });
  var cache;
  try { cache = JSON.parse(localStorage.getItem(cacheKey)); } catch (_) {}
  if (cache && Number.isFinite(cache.at) && cache.at <= Date.now() && Date.now() - cache.at < 15 * 60 * 1000 && Array.isArray(cache.items)) {
    fixtures = cache.items.filter(valid);
    if (fixtures.length) { loaded = true; render(); status.textContent = 'Recently checked · ' + new Date(cache.at).toLocaleTimeString('en-GB', {timeZone:'Europe/London',hour:'2-digit',minute:'2-digit'}) + ' UK time'; return; }
  }
  if (!window.fetch || !window.AbortController) { loaded = true; failed = leagues.length; render(); return; }
  Promise.all(leagues.map(function (league) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 9000);
    return fetch('https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php?id=' + league.id, { signal: controller.signal })
      .then(function (response) { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(function (data) {
        if (data.events !== null && !Array.isArray(data.events)) throw new Error('Invalid feed');
        return (data.events || []).map(function (event) { return {event:event,sport:league.sport}; }).filter(valid);
      })
      .catch(function () { failed++; return []; })
      .finally(function () { clearTimeout(timer); });
  })).then(function (results) {
    fixtures = results.flat().sort(function (a,b) { return dateFor(a.event) - dateFor(b.event); });
    loaded = true; render();
    status.textContent = failed ? 'Some competitions are unavailable. Showing the fixtures we could retrieve.' : 'Checked just now · Dates and times are supplied by the fixture provider.';
    if (failed === leagues.length) status.textContent = '';
    if (!failed) { try { localStorage.setItem(cacheKey, JSON.stringify({at:Date.now(),items:fixtures})); } catch (_) {} }
  });
}());
