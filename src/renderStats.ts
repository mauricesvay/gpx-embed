export function renderStats({
  totalDistance,
  positiveElevation,
}: {
  totalDistance: number | null;
  positiveElevation: number | null;
}) {
  const container = document.getElementById("stats");

  const formattedDistance = totalDistance
    ? Math.round(totalDistance / 10) / 100
    : null;

  const formattedPositiveElevation = positiveElevation
    ? Math.round(positiveElevation)
    : null;

  if (container && formattedDistance && formattedPositiveElevation) {
    container.innerHTML = `
    <ul class="panel flex maplibregl-ctrl maplibregl-ctrl-group">
      <li>Distance <strong>${formattedDistance}km</strong></li>
      <li>D+ <strong>${formattedPositiveElevation}m</strong></li>
    </ul>`;
    container.removeAttribute("hidden");
  }
}
