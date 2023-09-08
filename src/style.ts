import { StyleSpecification } from "maplibre-gl";

const STYLES = ["jawgsunny", "jawgdark", "cyclosm"] as const;
type Style = (typeof STYLES)[number];

export const isStyle = (value: unknown): value is Style =>
  STYLES.includes(value as Style);

const getCyclOSMStyle = (): StyleSpecification => ({
  version: 8,
  sources: {
    "raster-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "simple-tiles",
      type: "raster",
      source: "raster-tiles",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
});

const getJawgSunnyStyle = (accessToken: string) =>
  `https://api.jawg.io/styles/jawg-sunny.json?access-token=${accessToken}`;

const getJawgDarkStyle = (accessToken: string) =>
  `https://api.jawg.io/styles/jawg-dark.json?access-token=${accessToken}`;

export const getStyle = (style?: Style) => {
  switch (style) {
    case "jawgsunny":
      return getJawgSunnyStyle(
        "tj4jikFbVaSWErkfn9ZzIndBB8vwaJQdZULMQ1uuyO9NGfDPvZj9rNPR5U0V0iQC"
      );
    case "jawgdark":
      return getJawgDarkStyle(
        "tj4jikFbVaSWErkfn9ZzIndBB8vwaJQdZULMQ1uuyO9NGfDPvZj9rNPR5U0V0iQC"
      );
    default:
      return getCyclOSMStyle();
  }
};
