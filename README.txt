WESTGATE INTERNATIONAL EDUCATION | CINEMATIC WEBSITE
==================================================

WHAT IS INCLUDED
----------------
index.html         Lightweight redirect to home.html (required for GitHub Pages root URL)
home.html          Five-chapter, scroll-controlled Three.js landing page
services.html      Separate Services page with the eight offerings
assets/styles.css  Design, mobile layout, animations, fallback styling
assets/site.js     English / Japanese / Simplified Chinese UI and inquiry form
assets/experience.js  Procedural Three.js scene with camera-driven scroll movement
assets/world-poster.svg  Locally hosted illustrated fallback scene
assets/westgate-mark.png  Westgate corporate logo

PUBLISH ON GITHUB PAGES
-----------------------
1. Extract the ZIP. Open the westgate-cinematic folder.
2. Upload all files and the assets folder to the ROOT of the GitHub Pages
   publishing folder (or the root of the chosen Pages branch).
3. In GitHub: Settings > Pages, select the branch/folder to publish, save.
4. GitHub Pages serves index.html, which redirects to home.html. The main
   URL therefore works even though the landing page is named home.html.
5. Check the site online over HTTPS after the Pages deployment completes.

The site uses relative file paths, so it works at a custom domain and a
GitHub project URL (username.github.io/repository/).

THREE.JS
--------
The 3D animation uses Three.js r160 loaded as an ES module from jsDelivr,
with unpkg as a second CDN option. An Internet connection, WebGL-capable
browser and access to one of these CDNs are needed to display animated 3D.
A locally hosted illustrated world-poster.svg is shown if 3D is unavailable
or the visitor has enabled reduced-motion accessibility settings.

This is a procedural scene, not a copy of the MUGEN website or its assets.
3D materials, path, gates, gardens, lanterns and hall are generated in JS.

TRANSLATIONS
------------
Language is selected through the header's language switcher. English is
used when no preference has been stored. The choice is saved in the browser
and used on both home.html and services.html. For content editing, see the
translations in assets/site.js; all three languages must be updated.

INQUIRIES
---------
The contact form opens a prepared message in the visitor's email application
to max@wieg.co.jp. The visitor MUST click Send in that email application.
The website does NOT send or store messages automatically. For delivery
without opening an email app, configure a secure contact-form backend or
hosted forms service. Do not put credentials in static JavaScript.

COMPANY DATA
------------
The published content uses the information provided on Westgate business
cards. Verify legal address, titles, program availability and company claims
with the client before the public launch.

TESTING
-------
Basic JS syntax, local link structure, translation switching, service count,
mobile menu and desktop/mobile layout were checked in headless Chromium.
The build environment cannot reach the public Three.js CDN, so the locally
illustrated fallback was tested visually; verify live WebGL animation on an
Internet-connected browser after publishing.

LICENSE NOTES
-------------
Website layout and procedural scene code are custom for Westgate. Three.js
remains subject to its MIT license on its upstream CDN. Fonts are requested
from Google Fonts when online; fallback system fonts are included.
