import { isStyle } from "./style";
import { getUrlParams } from "./url";

const DEFAULTS = {
  gpx: "",
  style: "jawgsunny" as const,
  traceColor: "#CC3366" as const,
};

// @fixme: implement validation of gpx url
const isValidGpxUrl = (value: string) => value;

const isValidColor = (value: unknown) =>
  typeof value === "string" && value.match(/[0-9a-f]{3,6}/);

export const getParams = () => {
  const urlParams = getUrlParams();
  const validParams = {
    gpx: isValidGpxUrl(urlParams.gpx) ? urlParams.gpx : undefined,
    style: isStyle(urlParams.style) ? urlParams.style : undefined,
    traceColor: isValidColor(urlParams.traceColor)
      ? `#${urlParams.traceColor}`
      : undefined,
  };

  const params = {
    ...DEFAULTS,
    ...validParams,
  };
  return params;
};
