import { OverpassJsonOutput } from "overpass-ql-ts";
import { LatLngExpression } from "leaflet";
import i18next from "i18next";

const fetchApi = async (query: string) => {
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`failed to fetch overpass: ${await response.text()}`);
    }
    return response.json();
  } catch (error) {
    alert(i18next.t("errors.overpass"));
    console.error(error);
    throw error;
  }
};

export const fetchRoads = async (
  positions: LatLngExpression[],
): Promise<OverpassJsonOutput["elements"]> => {
  const coords = positions.flatMap((pos) => pos).join(" ");

  const query = `
[out:json];
way(poly:"${coords}")[highway][name];
out geom;`;

  return fetchApi(query);
};

export const fetchCityBoundaries = async (
  osmType: string,
  osmId: number,
): OverpassJsonOutput["elements"] => {
  const query = `
[out:json];
${osmType}(${osmId});
out geom;`;

  return fetchApi(query);
};
