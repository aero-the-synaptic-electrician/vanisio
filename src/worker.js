/**
 * @info Worker that retrieves skin samples for the client.
 */

addEventListener("message", (e) => {
    ((e) => {
      fetch(e, {
        mode: "cors"
      })
        .then((e) => e.blob())
        .then((e) => createImageBitmap(e))
        .then((s) =>
          self.postMessage({
            skinUrl: e,
            bitmap: s
          })
        )
        .catch(() =>
          self.postMessage({
            skinUrl: e,
            error: !0
          })
        );
    })(e.data);
  });
