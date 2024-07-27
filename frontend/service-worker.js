self.addEventListener("install", function (event) {
  console.log("Service worker installed");
});

self.addEventListener("fetch", function (event) {
  console.log("fetch called");
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
