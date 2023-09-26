import gpxParser from "gpxparser";
import MapLibreGL, { LngLatBounds, LngLatLike } from "maplibre-gl";

export function parseGpx(gpxString: string) {
  var gpx = new gpxParser();
  gpx.parse(gpxString);

  if (gpx.tracks.length) {
    const firstTrack = gpx.tracks[0];
    const totalDistance = firstTrack?.distance.total;
    const positiveElevation = firstTrack?.elevation.pos;
    const points = firstTrack?.points ?? [];
    const elevation = points.map(({ ele }) => ele);
    const geoPoints = points.map(({ lat, lon }) => ({
      lat,
      lng: lon,
    }));
    return { totalDistance, positiveElevation, elevation, geoPoints };
  }
  return {
    totalDistance: null,
    positiveElevation: null,
    elevation: [],
    geoPoints: [],
  };
}

export const getBoundingBox = (coordinates: LngLatLike[]) =>
  coordinates.reduce((bounds: LngLatBounds, coord: LngLatLike) => {
    return bounds.extend(coord);
  }, new MapLibreGL.LngLatBounds(coordinates[0], coordinates[0]));

export const gpxToGeoJson = (gpxString: string) => {
  const { geoPoints: points } = parseGpx(gpxString);
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
