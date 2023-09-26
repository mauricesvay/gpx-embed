import MapLibreGL, { LngLatLike } from "maplibre-gl";
import { getParams } from "./params";
import { getBoundingBox, gpxToGeoJson, parseGpx } from "./parseGpx";
import { getStyle } from "./style";

import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import { renderStats } from "./renderStats";

async function init() {
  const params = getParams();
  var map = new MapLibreGL.Map({
    container: "map",
    style: getStyle(params.style),
    center: [0, 0],
    zoom: 1,
  });

  map.on("load", async () => {
    map.addControl(new MapLibreGL.NavigationControl());

    const gpxUrl = params.gpx;
    if (!gpxUrl) {
      console.error(
        "No GPX url provided. Add gpx=<URL> to the query parameters"
      );
      return;
    }

    try {
      // Fetch
      const response = await window.fetch(gpxUrl);
      const text = await response.text();

      // Parse
      const geojson = gpxToGeoJson(text);

      // Stats
      const { totalDistance, positiveElevation } = parseGpx(text);
      renderStats({ totalDistance, positiveElevation });

      if (
        !geojson.features.some(
          (feature) =>
            feature.geometry.type === "LineString" &&
            Array.isArray(feature.geometry.coordinates) &&
            feature.geometry.coordinates.length
        )
      ) {
        throw new Error("No valid trace found");
      }

      // Display trace
      const startEndGeoJson = {
        ...geojson,
        features: geojson.features.filter(
          (feature) => feature.geometry.type !== "LineString"
        ),
      };
      map.addSource("GPXTrace", {
        type: "geojson",
        data: geojson,
      });
      map.addSource("GPXTraceStartEnd", {
        type: "geojson",
        data: startEndGeoJson,
      });
      map.addLayer({
        id: "LineString",
        type: "line",
        source: "GPXTrace",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": params.traceColor,
          "line-width": 5,
        },
      });
      map.addLayer({
        id: "Start",
        type: "circle",
        source: "GPXTraceStartEnd",
        paint: {
          "circle-color": "#FFFFFF",
          "circle-stroke-color": "#000000",
          "circle-stroke-width": 3,
        },
      });

      // Zoom on trace
      const line = geojson.features.find(
        (feature) => feature.geometry.type === "LineString"
      );
      if (line) {
        const coordinates = line.geometry.coordinates;
        // @fixme: unsafe cast
        const bounds = getBoundingBox(coordinates as LngLatLike[]);
        map.fitBounds(bounds, {
          padding: 20,
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
}

init();
