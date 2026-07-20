# Chords

An installable, backend-free React PWA. Songs and setlists are stored locally in IndexedDB; reader preferences are stored in localStorage. No application data leaves the device.

## Run locally

```sh
npm install
npm run dev
```

## Create a production build

```sh
npm run build
npm run preview
```

The PWA plugin generates `dist/sw.js` and precaches the application shell and static assets during the production build. Visit the app once while online, then it will start and operate offline. Browser downloads/imports remain local files and do not require a backend.

## Storage behavior

- `songs` and `setlists`: IndexedDB database `Chords`, object store `appState`
- Reader settings: localStorage keys beginning with `Chords:`
- A first launch starts with the included example songs and setlist; later changes persist locally.
