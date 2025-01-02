import type { StyleSpecification } from "maplibre-gl";

let maptilerApiKey = "MZEJTanw3WpxRvt7qDfo";

export async function getStyle(
  googleApiKey: string,
): Promise<string | StyleSpecification> {
  if (!googleApiKey) {
    return `https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerApiKey}`;
  }

  let sessionKey = await getGoogleSessionKey(googleApiKey);
  let tiles = `https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${sessionKey}&key=${googleApiKey}`;

  return {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [tiles],
        tileSize: 256,
        attribution: "Google (detailed attributions not wired up)",
      },
    },
    layers: [
      {
        id: "raster-basemap",
        type: "raster",
        source: "raster-tiles",
      },
    ],
    // Raster basemaps don't include glyphs; use the MapTiler ones
    glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${maptilerApiKey}`,
  };
}

async function getGoogleSessionKey(apiKey: string): Promise<string> {
  // See https://developers.google.com/maps/documentation/tile/session_tokens
  // These expire two weeks after being requested, so unless somebody has a tab open longer than that without navigating away or refreshing, we don't need to bother with re-fetching
  try {
    let resp = await fetch(
      `https://tile.googleapis.com/v1/createSession?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          mapType: "satellite",
          language: "en-GB",
          region: "GB",
        }),
      },
    );
    let json = await resp.json();
    if ("session" in json) {
      return json.session;
    }
    console.error(
      `Couldn't get Google tile session key: ${JSON.stringify(json)}`,
    );
    return "";
  } catch (err) {
    console.error(`Couldn't get Google tile session key: ${err}`);
    return "";
  }
}
