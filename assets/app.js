/* ==========================================================================
   Pelican Heating & Air — demo interactions
   Built by IntelliLine Solutions
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky header ---------------------------------------------- */
  var hdr = $('#hdr');
  var onScroll = function () {
    if (window.scrollY > 12) hdr.classList.add('is-stuck');
    else hdr.classList.remove('is-stuck');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav -------------------------------------------------- */
  var mobnav = $('#mobnav');
  var openNav = function () { mobnav.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  var closeNav = function () { mobnav.classList.remove('is-open'); document.body.style.overflow = ''; };
  $('#burger').addEventListener('click', openNav);
  $('#mobclose').addEventListener('click', closeNav);
  $$('#mobnav a').forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---------- scroll reveal ----------------------------------------------- */
  var revealed = new WeakSet();
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !revealed.has(en.target)) {
          revealed.add(en.target);
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- animated counters ------------------------------------------- */
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target.toFixed(dec) + suffix; return; }
    var dur = 1500, t0 = null;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec) + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  } else {
    $$('[data-count]').forEach(animateCount);
  }

  /* ---------- speed-to-lead flow highlight -------------------------------- */
  var flowItems = $$('.flow-i');
  var flowTimer = null;
  var runFlow = function () {
    if (reduce || !flowItems.length) return;
    var i = 0;
    clearInterval(flowTimer);
    flowTimer = setInterval(function () {
      flowItems.forEach(function (f) { f.classList.remove('is-on'); });
      flowItems[i].classList.add('is-on');
      i = (i + 1) % flowItems.length;
    }, 1400);
  };
  if ('IntersectionObserver' in window) {
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) runFlow();
        else clearInterval(flowTimer);
      });
    }, { threshold: 0.25 });
    if ($('#flow')) fio.observe($('#flow'));
  }

  /* ---------- FAQ ---------------------------------------------------------- */
  $$('.faq-i').forEach(function (item) {
    var q = $('.faq-q', item);
    var a = $('.faq-a', item);
    q.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      $$('.faq-i').forEach(function (o) {
        o.classList.remove('is-open');
        $('.faq-a', o).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- forms (speed-to-lead demo) ---------------------------------- */
  var runTimer = function (el, stopAt) {
    var t0 = performance.now();
    var tick = function (ts) {
      var s = (ts - t0) / 1000;
      if (s >= stopAt) { el.textContent = stopAt.toFixed(1); return; }
      el.textContent = s.toFixed(1);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  var wireForm = function (formId, wrapId, successId, timerId, stopAt) {
    var form = $(formId);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = $$('[required]', form);
      var bad = false;
      required.forEach(function (f) {
        if (!f.value.trim()) { f.style.borderColor = '#F87171'; bad = true; }
        else { f.style.borderColor = ''; }
      });
      if (bad) return;
      $(wrapId).style.display = 'none';
      $(successId).classList.add('is-on');
      runTimer($(timerId), stopAt);
    });
    $$('input, select', form).forEach(function (f) {
      f.addEventListener('input', function () { f.style.borderColor = ''; });
    });
  };
  wireForm('#heroForm', '#heroFormWrap', '#heroSuccess', '#heroTimer', 0.8);
  wireForm('#mainForm', '#mainFormWrap', '#mainSuccess', '#mainTimer', 1.1);

  /* ---------- missed-call SMS animation ------------------------------------ */
  var smsBody = $('#smsBody');
  var smsScript = [
    { k: 'sys', t: 'Missed call · Today 7:42 PM' },
    { k: 'us', t: "Hi, this is Pelican Heating & Air — sorry we missed you! We're with a customer right now. What's going on with your system?", d: 600 },
    { k: 'them', t: "AC stopped blowing cold about an hour ago. House is 84 inside.", d: 1000 },
    { k: 'us', t: "That's no fun. Are you in Carlsbad or nearby?", d: 800 },
    { k: 'them', t: "La Costa, near Alga Rd.", d: 850 },
    { k: 'us', t: "Perfect — we've got a technician finishing in Aviara. We can be there between 9:00 and 10:30 tonight. Want me to lock that in?", d: 1000 },
    { k: 'them', t: "Yes please 🙏", d: 800 },
    { k: 'us', t: "Booked. Marcus is on his way — you'll get a text when he's 15 minutes out.", d: 950 }
  ];
  var smsTimeouts = [];
  var playSms = function () {
    smsTimeouts.forEach(clearTimeout);
    smsTimeouts = [];
    smsBody.innerHTML = '';
    var acc = 0;
    smsScript.forEach(function (m) {
      acc += (m.d || 400);
      smsTimeouts.push(setTimeout(function () {
        var el = document.createElement('div');
        el.className = 'sms sms--' + m.k;
        el.textContent = m.t;
        smsBody.appendChild(el);
        smsBody.scrollTop = smsBody.scrollHeight;
      }, reduce ? 0 : acc));
    });
  };
  if (smsBody) {
    if ('IntersectionObserver' in window) {
      var played = false;
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !played) { played = true; playSms(); }
        });
      }, { threshold: 0.3 });
      sio.observe(smsBody);
    } else { playSms(); }
    $('#smsReplay').addEventListener('click', playSms);
  }

  /* ---------- chat widget --------------------------------------------------- */
  var chat = $('#chat'), fab = $('#chatFab'), bubble = $('#chatBubble');
  var body = $('#chatBody'), opts = $('#chatOpts'), input = $('#chatInput');
  var chatStarted = false;

  var addMsg = function (kind, text) {
    var el = document.createElement('div');
    el.className = 'cm cm--' + kind;
    el.innerHTML = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  };
  var typing = function () {
    var el = document.createElement('div');
    el.className = 'typing';
    el.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  };
  var botSay = function (text, delay, cb) {
    var t = typing();
    setTimeout(function () {
      t.remove();
      addMsg('bot', text);
      if (cb) cb();
    }, reduce ? 60 : (delay || 900));
  };
  var setOpts = function (list) {
    opts.innerHTML = '';
    (list || []).forEach(function (o) {
      var b = document.createElement('button');
      b.className = 'chat-opt';
      b.textContent = o.label;
      b.addEventListener('click', function () {
        addMsg('me', o.label);
        opts.innerHTML = '';
        setTimeout(function () { o.next(); }, 260);
      });
      opts.appendChild(b);
    });
  };

  var flowBook = function (issue) {
    botSay('Got it — <b>' + issue + '</b>. Which city are you in?', 850, function () {
      setOpts([
        { label: 'Carlsbad', next: function () { askUrgency('Carlsbad'); } },
        { label: 'Encinitas', next: function () { askUrgency('Encinitas'); } },
        { label: 'Oceanside', next: function () { askUrgency('Oceanside'); } },
        { label: 'Somewhere else', next: function () { askUrgency('North County'); } }
      ]);
    });
  };
  var askUrgency = function (city) {
    botSay('We cover ' + city + ' daily. How soon do you need someone?', 850, function () {
      setOpts([
        { label: 'Today if possible', next: function () { handoff('same-day'); } },
        { label: 'Next day or two', next: function () { handoff('next-day'); } },
        { label: 'Just want a quote', next: function () { handoff('quote'); } }
      ]);
    });
  };
  var handoff = function (kind) {
    var line = kind === 'quote'
      ? "Happy to put a free written estimate together."
      : "We hold slots for exactly this — I can get you on today's board.";
    botSay(line + ' What\'s the best mobile number to text you on?', 900, function () {
      addMsg('sys', 'Connecting you to a live team member…');
      setTimeout(function () {
        botSay('<b>Dana</b> from our Carlsbad office has joined the chat — she has everything you\'ve told me and can confirm your window right now. 👋', 1000, function () {
          setOpts([
            { label: '📞 Call (760) 750-2179', next: function () { window.location.href = 'tel:+17607502179'; } },
            { label: 'Use the estimate form', next: function () {
                addMsg('bot', 'Sent you down to the form — fill it in and we\'ll text you within the minute.');
                closeChat();
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
              } }
          ]);
        });
      }, reduce ? 60 : 1200);
    });
  };

  var startChat = function () {
    if (chatStarted) return;
    chatStarted = true;
    botSay('Hi! I\'m the Pelican assistant. I can get you scheduled or answer a quick question — what\'s going on?', 700, function () {
      setOpts([
        { label: 'My AC isn\'t cooling', next: function () { flowBook('AC not cooling'); } },
        { label: 'No heat', next: function () { flowBook('no heat'); } },
        { label: 'Need a new system quote', next: function () { flowBook('replacement quote'); } },
        { label: 'Maintenance / tune-up', next: function () { flowBook('maintenance visit'); } }
      ]);
    });
  };

  var openChat = function () {
    chat.classList.add('is-open');
    fab.classList.add('is-hidden');
    bubble.classList.remove('is-on');
    startChat();
  };
  var closeChat = function () {
    chat.classList.remove('is-open');
    fab.classList.remove('is-hidden');
  };
  fab.addEventListener('click', openChat);
  $('#chatX').addEventListener('click', closeChat);

  var sendTyped = function () {
    var v = input.value.trim();
    if (!v) return;
    addMsg('me', v.replace(/</g, '&lt;'));
    input.value = '';
    opts.innerHTML = '';
    botSay('Thanks — I\'ve passed that straight to the team. The fastest way to lock in a time is a quick call.', 900, function () {
      setOpts([
        { label: '📞 Call (760) 750-2179', next: function () { window.location.href = 'tel:+17607502179'; } },
        { label: 'Send the estimate form', next: function () {
            closeChat();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          } }
      ]);
    });
  };
  $('#chatSend').addEventListener('click', sendTyped);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendTyped(); });

  /* first-visit nudge */
  setTimeout(function () {
    if (!chat.classList.contains('is-open')) bubble.classList.add('is-on');
  }, 4200);
  setTimeout(function () { bubble.classList.remove('is-on'); }, 13000);
  bubble.addEventListener('click', openChat);


  /* ---------- hero carousel ------------------------------------------------ */
  var slides = $$('.slide'), hDots = $$('.hdot'), hNum = $('#hNum');
  var cur = 0, autoTimer = null;
  var goSlide = function (i) {
    if (!slides.length) return;
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle('is-on', n === cur); });
    hDots.forEach(function (d, n) { d.classList.toggle('is-on', n === cur); });
    if (hNum) hNum.textContent = String(cur + 1).padStart(2, '0');
  };
  var restartAuto = function () {
    clearInterval(autoTimer);
    if (reduce || slides.length < 2) return;
    autoTimer = setInterval(function () { goSlide(cur + 1); }, 7000);
  };
  if (slides.length) {
    $('#hPrev').addEventListener('click', function () { goSlide(cur - 1); restartAuto(); });
    $('#hNext').addEventListener('click', function () { goSlide(cur + 1); restartAuto(); });
    hDots.forEach(function (d, n) {
      d.addEventListener('click', function () { goSlide(n); restartAuto(); });
    });
    restartAuto();
  }

  /* ---------- live Carlsbad weather ---------------------------------------- */
  var wx = $('#wx');
  if (wx) {
    var WMO = {
      0:['Clear sky','sun'], 1:['Mainly clear','sun'], 2:['Partly cloudy','partly'],
      3:['Overcast','cloud'], 45:['Fog','fog'], 48:['Freezing fog','fog'],
      51:['Light drizzle','rain'], 53:['Drizzle','rain'], 55:['Heavy drizzle','rain'],
      56:['Freezing drizzle','rain'], 57:['Freezing drizzle','rain'],
      61:['Light rain','rain'], 63:['Rain','rain'], 65:['Heavy rain','rain'],
      66:['Freezing rain','rain'], 67:['Freezing rain','rain'],
      71:['Light snow','snow'], 73:['Snow','snow'], 75:['Heavy snow','snow'], 77:['Snow grains','snow'],
      80:['Light showers','rain'], 81:['Showers','rain'], 82:['Heavy showers','rain'],
      85:['Snow showers','snow'], 86:['Snow showers','snow'],
      95:['Thunderstorm','storm'], 96:['Thunderstorm','storm'], 99:['Thunderstorm','storm']
    };

    var ART = {
      sun:'<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="13" fill="#F0B078"/><g stroke="#E69A60" stroke-width="3.4" stroke-linecap="round"><path d="M32 6v7M32 51v7M6 32h7M51 32h7M13.6 13.6l5 5M45.4 45.4l5 5M50.4 13.6l-5 5M18.6 45.4l-5 5"/></g></svg>',
      partly:'<svg viewBox="0 0 64 64" fill="none"><circle cx="25" cy="24" r="10" fill="#F0B078"/><g stroke="#E69A60" stroke-width="3" stroke-linecap="round"><path d="M25 4v5M25 39v3M5 24h5M8.9 9.9l3.5 3.5M41.1 9.9l-3.5 3.5"/></g><path d="M22 46a9 9 0 0 1 8.9-9 12 12 0 0 1 22.6 4.3A7.5 7.5 0 0 1 52 53H30a8 8 0 0 1-8-7z" fill="#BFE3EE" opacity=".92"/></svg>',
      cloud:'<svg viewBox="0 0 64 64" fill="none"><path d="M16 44a10 10 0 0 1 9.9-10 13 13 0 0 1 25 4.8A8.4 8.4 0 0 1 49 52H25a9 9 0 0 1-9-8z" fill="#BFE3EE" opacity=".9"/><path d="M26 26a11 11 0 0 1 19-4" stroke="#7FC5D8" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg>',
      fog:'<svg viewBox="0 0 64 64" fill="none"><path d="M16 36a10 10 0 0 1 9.9-10 13 13 0 0 1 25 4.8A8.4 8.4 0 0 1 49 44H25a9 9 0 0 1-9-8z" fill="#BFE3EE" opacity=".85"/><g stroke="#7FC5D8" stroke-width="3.2" stroke-linecap="round" opacity=".75"><path d="M14 51h36M20 58h26"/></g></svg>',
      rain:'<svg viewBox="0 0 64 64" fill="none"><path d="M16 34a10 10 0 0 1 9.9-10 13 13 0 0 1 25 4.8A8.4 8.4 0 0 1 49 42H25a9 9 0 0 1-9-8z" fill="#BFE3EE" opacity=".9"/><g stroke="#3E9DBA" stroke-width="3.4" stroke-linecap="round"><path d="M24 48l-3 8M35 48l-3 8M46 48l-3 8"/></g></svg>',
      snow:'<svg viewBox="0 0 64 64" fill="none"><path d="M16 34a10 10 0 0 1 9.9-10 13 13 0 0 1 25 4.8A8.4 8.4 0 0 1 49 42H25a9 9 0 0 1-9-8z" fill="#BFE3EE" opacity=".9"/><g stroke="#7FC5D8" stroke-width="3" stroke-linecap="round"><path d="M23 50v7M19.5 51.8l7 3.4M26.5 51.8l-7 3.4M41 50v7M37.5 51.8l7 3.4M44.5 51.8l-7 3.4"/></g></svg>',
      storm:'<svg viewBox="0 0 64 64" fill="none"><path d="M16 32a10 10 0 0 1 9.9-10 13 13 0 0 1 25 4.8A8.4 8.4 0 0 1 49 40H25a9 9 0 0 1-9-8z" fill="#BFE3EE" opacity=".9"/><path d="M34 42l-9 12h7l-3 10 11-14h-7z" fill="#E69A60"/></svg>'
    };

    var setBadge = function (live) {
      var b = $('#wxBadge'), t = $('#wxBadgeT');
      if (!b || !t) return;
      b.classList.toggle('is-snap', !live);
      t.textContent = live ? 'LIVE' : 'SNAPSHOT';
    };

    /* cooling demand: driven by temperature, nudged by humidity */
    var demand = function (tempF, hum) {
      var score = (tempF - 62) * 3.2 + (hum - 45) * 0.35;
      score = Math.max(4, Math.min(100, Math.round(score)));
      var label = score < 25 ? 'Low' : score < 50 ? 'Moderate' : score < 75 ? 'High' : 'Very high';
      return { score: score, label: label };
    };

    var paint = function (c, daily) {
      var code = WMO[c.weather_code] || ['—', 'cloud'];
      $('#wxTemp').textContent = Math.round(c.temperature_2m);
      $('#wxCond').textContent = code[0];
      $('#wxFeels').innerHTML = Math.round(c.apparent_temperature) + '&deg;';
      $('#wxHum').textContent = Math.round(c.relative_humidity_2m) + '%';
      $('#wxWind').textContent = Math.round(c.wind_speed_10m) + ' mph';
      $('#wxIcon').innerHTML = ART[code[1]] || ART.cloud;
      if (daily) {
        $('#wxHigh').innerHTML = Math.round(daily.temperature_2m_max[0]) + '&deg;';
        $('#wxLow').innerHTML = Math.round(daily.temperature_2m_min[0]) + '&deg;';
      }
      var d = demand(c.temperature_2m, c.relative_humidity_2m);
      $('#wxLoadT').textContent = d.label;
      $('#wxLoadBar').style.width = d.score + '%';
      var t = new Date();
      $('#wxTime').textContent = t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    var load = function () {
      var url = 'https://api.open-meteo.com/v1/forecast'
        + '?latitude=33.1581&longitude=-117.3506'
        + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m'
        + '&daily=temperature_2m_max,temperature_2m_min'
        + '&temperature_unit=fahrenheit&wind_speed_unit=mph'
        + '&timezone=America%2FLos_Angeles&forecast_days=1';
      fetch(url)
        .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
        .then(function (j) {
          if (!j || !j.current) throw new Error('bad payload');
          paint(j.current, j.daily);
          setBadge(true);
        })
        .catch(function () {
          /* offline, blocked, or rate-limited -- keep the seeded numbers,
             but never claim they are live */
          setBadge(false);
          $('#wxIcon').innerHTML = ART.cloud;
        });
    };

    setBadge(false);
    load();
    setInterval(load, 10 * 60 * 1000);
  }

  /* ---------- avg response ticker ------------------------------------------ */
  var avg = $('#avgResp');
  if (avg && !reduce) {
    setInterval(function () {
      avg.textContent = (41 + Math.floor(Math.random() * 12)) + 's';
    }, 5000);
  }

  /* ---------- request-a-call bar -------------------------------------------- */
  var reqForm = $('#reqForm');
  if (reqForm) {
    reqForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#reqPhone');
      if (!v.value.trim()) { v.style.borderColor = '#F87171'; return; }
      reqForm.style.display = 'none';
      $('#reqOk').classList.add('is-on');
      setTimeout(function () {
        $('#reqOk').classList.remove('is-on');
        reqForm.style.display = '';
        v.value = ''; v.style.borderColor = '';
      }, 6000);
    });
  }

  /* ---------- chat bubble dismiss ------------------------------------------- */
  var bx = $('#chatBubbleX');
  if (bx) {
    bx.addEventListener('click', function (e) {
      e.stopPropagation();
      bubble.classList.remove('is-on');
    });
  }

  /* ---------- smooth anchor offset ---------------------------------------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
