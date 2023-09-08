import gpxParser from "gpxparser";
import MapLibreGL, { LngLatBounds, LngLatLike } from "maplibre-gl";

function parseKomootGpx(gpxString: string) {
  var gpx = new gpxParser();
  gpx.parse(gpxString);
  const points = gpx.tracks?.[0]?.points ?? [];
  return points.map(({ lat, lon }) => ({
    lat,
    lng: lon,
  }));
}

export const getBoundingBox = (coordinates: LngLatLike[]) =>
  coordinates.reduce((bounds: LngLatBounds, coord: LngLatLike) => {
    return bounds.extend(coord);
  }, new MapLibreGL.LngLatBounds(coordinates[0], coordinates[0]));

export const gpxToGeoJson = (gpxString: string) => {
  const points = parseKomootGpx(gpxString);
  const geojsonPoints = points.map(({ lng, lat }) => [lng, lat] as LngLatLike);
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: geojsonPoints[0],
          type: "Point",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          properties: {},
          coordinates: geojsonPoints,
        },
      },
    ],
  };
  return geojson;
};
