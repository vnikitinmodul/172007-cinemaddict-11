const PREFIX = `cinemaddict-cache`;
const VER = `v1`;
const NAME = `${PREFIX}-${VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/main.css`,
            `/css/normalize.css`,
            `/images/emoji/angry.png`,
            `/images/emoji/puke.png`,
            `/images/emoji/sleeping.png`,
            `/images/emoji/smile.png`,
            `/images/icons/icon-favorite.svg`,
            `/images/icons/icon-favorite-active.svg`,
            `/images/icons/icon-watched.svg`,
            `/images/icons/icon-watched-active.svg`,
            `/images/icons/icon-watchlist.svg`,
            `/images/icons/icon-watchlist-active.svg`,
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(activateCache)
  );
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => (
          cacheResponse ? cacheResponse : onResponseFetch(request)
        ))
  );
});

const activateCache = (keys) => {
  Promise.all(
      keys.map(
          (key) => {
            if (key.startsWith(PREFIX) && key !== NAME) {
              return caches.delete(key);
            }
            return null;
          })
        .filter((key) => key !== null)
  );
};

const onResponseFetch = (request) => (
  fetch(request)
    .then((response) => {
      if (!response || response.status !== 200 || response.type !== `basic`) {
        return response;
      }

      const clonedResponse = response.clone();

      caches.open(NAME)
        .then((cache) => cache.put(request, clonedResponse));
      return response;
    })
);
