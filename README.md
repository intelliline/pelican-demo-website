# Pelican Heating & Air — demo site

Static 5-page demo built for the Pelican Heating & Air pitch. No build step, no dependencies.

```
index.html            home — 14 sections
services.html         11 services, deep sections with anchors
systems.html          equipment, air quality, maintenance plans, rebates
service-areas.html    12 cities, each with its own anchor
contact.html          contact cards, form, hours, illustrative map
assets/styles.css
assets/app.js
vercel.json
_build/               page generators (safe to delete; keeps the 5 pages consistent)
```

## Deploy (same pattern as fds-demo-website)

1. `git init && git add . && git commit -m "Pelican demo site"`
2. Create repo `pelican-demo-website` under the `intelliline` GitHub account and push.
3. Import it in Vercel under the **Professional Stunt Artists** team. Framework preset: **Other**. No build command, output directory `.` (root).
4. Add the domain `pelican-demo-website.intellilinesolutions.com` in Project → Settings → Domains.

`vercel.json` sets `X-Robots-Tag: noindex`, and every page carries a `noindex,nofollow` meta tag. Remove both if this ever becomes a live site.

## Page by page

**index.html** — built to match the fds-demo-website structure:

1. Demo ribbon
2. **Request A Call bar** — phone capture, "we call you back in under 60 seconds", live average-response badge
3. Social row — Google, Yelp, BBB, map (real links)
4. Sticky header
5. **Hero** — 3-slide carousel (arrows, dots, 01/03 counter, 7s autoplay) beside an **animated live system dashboard**: four zones with drifting temperatures, live timestamps, filter life, runtime, and a technician-ETA strip. This is the HVAC equivalent of the FDS live camera grid.
6. Proof stack — avatar row, stars, license, city count
7. Welcome / about fold
8. Stat strip — 25+ years, 12 cities, 5.0 rating, <60s response
9. **Speed to Lead** — headline, three conversion stat cards (50% / 10% / 3x), the 4-step timeline, and the missed-call text-back SMS animation side by side
10. **Free estimate fold** — benefits list beside a full quote form with the live response counter
11. **City marquee** — continuous scrolling ticker of all 12 cities
12. Services grid · 13. Why Pelican · 14. Process · 15. Reviews · 16. Service-area map · 17. Equipment · 18. Offer · 19. FAQ · 20. Contact · Footer

The Request A Call bar, social row, chat pill and emergency band appear on all five pages.

**services.html** — sticky jump-nav, then eleven full sections: AC repair, AC installation, heating repair, heating installation, heat pumps, mini-splits, indoor air quality, ductwork, thermostats, maintenance, emergency. Each has symptom lists, a dark detail card, and its own CTAs.

**systems.html** — coastal equipment spec grid, air-quality section with a "where to start" order of operations, three maintenance plan tiers, rebates and financing.

**service-areas.html** — jump-nav, coverage map, then twelve city sections with local detail (salt-air corrosion on the coast, Escondido heat loads, La Costa upstairs/downstairs balancing, and so on).

**contact.html** — three contact cards, full request form with the response counter, 24/7 hours table, illustrative office map.

Shared across every page: the AI chat widget (qualifies on issue → city → urgency, then hands off to a named live agent), the mobile call bar, and the emergency band.

## Before it goes anywhere real

- **Reviews are placeholders.** They're written and labelled as samples on purpose — swap in real Google reviews, or wire the live review feed, before this is presented as a real site.
- **Maintenance plan tiers and the seasonal offer are placeholders**, labelled as such on the page. Names, inclusions and pricing are yours to set.
- **The logo** loads from Pelican's own CDN. To self-host, drop a `logo.png` into `assets/` and replace the `https://vibe.filesafe.space/...` image URLs across the five HTML files.
- **Forms and chat are front-end only.** Nothing is submitted. Point the forms at the real endpoint and swap the scripted chat for the live widget when the backend is connected.
- **Phone, address, license number, hours and service-area list** came from pelicanheatingandair.com. The per-city and per-service copy is written for the pitch — worth a read-through so nothing contradicts how they actually work.
- The contact-page map is an illustration. The live site would embed Google Maps.

## Editing

`_build/` holds small Python generators for the four inner pages, so shared header, footer, chat and emergency band stay identical everywhere. Edit the data in `_build/services.py` or `_build/areas.py`, run `python3 make.py` from inside `_build/`, and the pages regenerate. Editing the HTML directly works fine too — just don't do both.

## Brand tokens

Deep `#0F333E` · Teal `#227791` · Sand `#E69A60` · Font: Manrope. All defined as CSS variables at the top of `assets/styles.css`.
