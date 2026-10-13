/* Repliva.lt home page motion: rotating headline word + sample review/reply list with typing.
   The page is complete without this script; it only animates content already in the HTML. */
(function () {
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lt = document.documentElement.lang !== 'en';

  /* Rotating last word of the headline */
  var words = document.querySelectorAll('.rot span');
  if (words.length > 1) {
    var w = 0;
    setInterval(function () {
      var cur = words[w];
      cur.classList.remove('on');
      cur.classList.add('out');
      w = (w + 1) % words.length;
      words[w].classList.remove('out');
      words[w].classList.add('on');
      setTimeout(function () { cur.classList.remove('out'); }, 600);
    }, 2600);
  }

  /* Sample reviews and replies (examples, not real customers) */
  var demo = document.getElementById('demo');
  if (!demo) return;
  var dots = document.querySelectorAll('.pager i');

  var S = lt ? [
    { s: 5, r: 'Greitai sutvarkė automobilį, maloniai paaiškino, ką keitė. Ačiū!', t: 'po 3 val.', a: 'Dėkojame už atsiliepimą. Mums svarbu ne tik greitai sutaisyti, bet ir paaiškinti, kas buvo pakeista, tad labai džiugu, kad tai pastebėjote. Saugaus kelio!' },
    { s: 5, r: 'Labai patiko kirpimas, meistrė išklausė, ko noriu.', t: 'po 5 val.', a: 'Ačiū, kad pasidalinote! Smagu, kad pavyko padaryti būtent tai, ko norėjote. Lauksime sugrįžtant.' },
    { s: 4, r: 'Skanūs pusryčiai, tik teko ilgokai palaukti kavos.', t: 'po 2 val.', a: 'Ačiū už gerus žodžius ir už pastabą apie kavą. Perdavėme ją komandai, kad rytais aptarnautume greičiau. Iki pasimatymo!' }
  ] : [
    { s: 5, r: 'Fixed my car quickly and kindly explained what they replaced. Thank you!', t: '3 hours later', a: 'Thank you for your review. It matters to us not only to fix things quickly but also to explain what was replaced, so we are very glad you noticed. Safe travels!' },
    { s: 5, r: 'Loved the haircut, the stylist really listened to what I wanted.', t: '5 hours later', a: 'Thank you for sharing! We are glad we got it exactly the way you wanted. See you next time.' },
    { s: 4, r: 'Tasty breakfast, but the coffee took a while to arrive.', t: '2 hours later', a: 'Thank you for the kind words and for the note about the coffee. We have passed it on to the team so mornings run faster. See you soon!' }
  ];
  var L = lt
    ? { name: 'Pavyzdinis atsiliepimas', reply: 'Įmonės atsakymas · ', stars: ' žvaigždutės' }
    : { name: 'Sample review', reply: 'Company reply · ', stars: ' stars' };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function review(d) {
    var box = el('div', 'rv item');
    var head = el('div', 'rh');
    var av = el('span', 'av', 'P'); av.setAttribute('aria-hidden', 'true');
    if (!lt) av.textContent = 'S';
    var st = el('span', 'st', '★★★★★'.slice(0, d.s));
    st.setAttribute('aria-label', d.s + L.stars);
    if (d.s < 5) { var off = el('span', 'off', '★★★★★'.slice(d.s)); st.appendChild(off); }
    head.appendChild(av);
    head.appendChild(document.createTextNode(L.name + ' '));
    head.appendChild(st);
    box.appendChild(head);
    box.appendChild(el('p', '', d.r));
    return box;
  }

  var i = 0, timer;

  function show(k) {
    var d = S[k];
    dots.forEach(function (e, j) { e.classList.toggle('on', j === k); });
    demo.classList.add('live');
    demo.textContent = '';
    demo.appendChild(review(d));

    timer = setTimeout(function () {
      var rp = el('div', 'rp item');
      rp.appendChild(el('div', 'rh', L.reply + d.t));
      var p = el('p', 'txt');
      p.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
      rp.appendChild(p);
      demo.appendChild(rp);

      timer = setTimeout(function () {
        p.textContent = '';
        rp.classList.add('typing');
        var n = 0;
        (function type() {
          p.textContent = d.a.slice(0, ++n);
          if (n < d.a.length) { timer = setTimeout(type, 22); return; }
          rp.classList.remove('typing');
          timer = setTimeout(function () { i = (i + 1) % S.length; show(i); }, 4000);
        })();
      }, 1100);
    }, 900);
  }

  /* Pause while the tab is hidden, restart cleanly when it comes back */
  document.addEventListener('visibilitychange', function () {
    clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(function () { i = (i + 1) % S.length; show(i); }, 1500);
  });

  timer = setTimeout(function () { i = 1; show(1); }, 5000);
})();
