(function () {
  'use strict';

  var ales = {
    'level-head': { name: 'Level Head', style: 'Session IPA', abv: '4.0% ABV', description: 'A balanced, easy-drinking IPA created for a full-flavoured but sessionable pint.', notes: 'Tropical fruit, citrus and gentle bitterness.' },
    'neck-oil': { name: 'Beavertown Neck Oil', style: 'Session IPA', abv: '4.3% ABV', description: 'Beavertown’s crisp and refreshing session IPA, designed as an approachable introduction to hop-forward beer.', notes: 'Fresh citrus, passionfruit and a light, zesty finish.' },
    'hazy-day': { name: 'Hazy Day', style: 'Fruity IPA', abv: '4.5% ABV', description: 'A soft, hazy IPA with a fruit-led character and an easy finish.', notes: 'Juicy tropical fruit, citrus and gentle malt sweetness.' },
    'gk-ipa': { name: 'Greene King IPA', style: 'English IPA', abv: '3.4% ABV', description: 'Greene King’s flagship easy-drinking ale, brewed in Bury St Edmunds with English hops.', notes: 'Fresh herbal hops, toffee and caramel, finishing clean and dry.' },
    'london-glory': { name: 'London Glory', style: 'British Ale', abv: '4.0% ABV', description: 'A rich and fruity ale created as a celebration of the capital.', notes: 'Sweet malt, soft toffee, fruity esters and balanced herbal bitterness.' },
    'session-hen': { name: 'Old Session Hen', style: 'Amber Ale', abv: '3.8% ABV', description: 'A lighter member of the Hen family, made for relaxed, easy drinking.', notes: 'Hints of tropical fruit with a crisp, clean finish.' },
    'st-edmunds': { name: 'St Edmunds', style: 'Pale Ale', abv: '4.2% ABV', description: 'A pale ale named for Greene King’s historic Suffolk home.', notes: 'Light malt, delicate fruit and a refreshing hop finish.' },
    'speckled-hen': { name: 'Old Speckled Hen', style: 'English Ale', abv: '5.0% ABV', description: 'The distinctive British ale first brewed in 1979 to commemorate the MG car factory.', notes: 'Rich toffee and caramel malt, pear-drop fruit and a light herbal note.' },
    'crafty-hen': { name: 'Old Crafty Hen', style: 'Rich Dark Ale', abv: '6.5% ABV', description: 'A complex blend of Old Speckled Hen and oak-aged Old 5X for a rounded, warming beer.', notes: 'Toffee, dried fruit, raisin, citrus and a smooth finish.' },
    'old-bob': { name: 'Old Bob', style: 'Strong Ale', abv: '6.0% ABV', description: 'A full-bodied strong ale with a traditional, warming character.', notes: 'Deep malt, caramel, dark fruit and a lingering finish.' }
  };

  var panel = document.getElementById('ale-detail');
  if (!panel) return;
  var scene = document.getElementById('coaster-scene');
  var buttons = document.querySelectorAll('[data-ale]');
  var closeButton = panel.querySelector('.ale-detail-close');
  var opener;

  function showAle(button) {
    var ale = ales[button.getAttribute('data-ale')];
    if (!ale) return;
    document.getElementById('ale-name').textContent = ale.name;
    document.getElementById('ale-style').textContent = ale.style;
    document.getElementById('ale-description').textContent = ale.description;
    document.getElementById('ale-notes').textContent = ale.notes;
    buttons.forEach(function (item) { item.classList.toggle('is-active', item === button); });
    opener = button;
    panel.showModal();
    closeButton.focus();
  }

  function closePanel() {
    panel.close();
  }

  panel.addEventListener('close', function () {
    buttons.forEach(function (item) { item.classList.remove('is-active'); });
    if (opener) opener.focus();
  });

  buttons.forEach(function (button) { button.addEventListener('click', function () { showAle(button); }); });
  closeButton.addEventListener('click', closePanel);
  panel.addEventListener('click', function (event) { if (event.target === panel) {
    var rect = panel.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closePanel();
  } });
}());
