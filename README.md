# NUPS-G UENR – Progressive Web App

**National Union of Presbyterian Students – Ghana**  
University of Energy and Natural Resources (Sunyani)

> *“For to me, to live is Christ and to die is gain.”* — Philippians 1:21  
> **Slogan:** NUPS-G! For Christ!

---

## Features

- **Sign Up / Sign In** – Create an account or log in (demo storage)
- **Home Feed** – Post updates, testimonies & announcements with optional image upload
- **Wings** – Join any of the 7 wings:
  - Bible
  - Prayer
  - Evangelism
  - Reformed Vessels
  - Pearls of Zion
  - Media
  - NUPS-G Coordination Team
- **Search** – Find posts and wings instantly
- **Messages / Chat** – Community channels (General, Prayer Requests, Evangelism)
- **Profile** – View your info, joined wings, and post count
- **Dark / Light Theme** – Toggle with one tap
- **Fully Responsive** – Works beautifully on phones, tablets and desktops
- **Installable PWA** – Add to home screen from Chrome / Safari / Edge
- **Offline-ready** – Service worker caches core assets

---

## How to Use

### Option 1 – Open directly
1. Open `index.html` in any modern browser.

### Option 2 – Local server (recommended for PWA install)
```bash
cd nupsg-uenr-app
npx serve .
# or
python3 -m http.server 8080
```
Then visit `http://localhost:8080` (or the port shown).

### Install on phone
1. Open the app in Chrome (Android) or Safari (iOS).
2. Tap “Add to Home Screen” / Install when prompted.
3. The app opens full-screen like a native app.

---

## Tech Stack

- Pure HTML5 + CSS3 + Vanilla JavaScript
- Progressive Web App (manifest + service worker)
- localStorage for demo persistence
- No build step required – ready to deploy anywhere

---

## Customisation Notes

- Replace the logo mark in the CSS / HTML with an official NUPS-G UENR logo image when available.
- Connect a real backend (Firebase, Supabase, or custom API) for production auth, posts and chat.
- Update `manifest.json` icons with high-quality branded icons.

---

**Built with love for NUPS-G UENR**  
Glory to God.
