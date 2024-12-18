const LAST_BBOX = "LAST_BBOX";
export const getMapBounds = (): [[number, number], [number, number]] =>
  JSON.parse(
    localStorage.getItem(LAST_BBOX) ||
      "[[47.85325621219623,16.36997222900391],[47.81350035422176,16.459751129150394]]",
  );
export const setMapBounds = (bbox: [[number, number], [number, number]]) =>
  localStorage.setItem(LAST_BBOX, JSON.stringify(bbox));

const LAST_SELECTION = "LAST_SELECTION";
export const getLastSelection = (): [number, number][] =>
  JSON.parse(
    localStorage.getItem(LAST_SELECTION) ||
      "[[47.846634,16.407737],[47.83825,16.423059],[47.827276,16.424478],[47.82987,16.404644],[47.838682,16.395121],[47.846634,16.407737]]",
  );
export const setLastSelection = (bbox: [number, number][]) =>
  localStorage.setItem(LAST_SELECTION, JSON.stringify(bbox));

const MAP_LAYER = "MAP_LAYER";
export const getMapLayer = (): "carto" | "esri" =>
  (localStorage.getItem(MAP_LAYER) as any) || "esri";
export const setMapLayer = (layer: "carto" | "esri") =>
  localStorage.setItem(MAP_LAYER, layer);

const TUTORIAL = "TUTORIAL";
export const isTutorialAcknowledged = (): boolean =>
  (localStorage.getItem(TUTORIAL) || "false") === "true";
export const acknowledgeTutorial = () => localStorage.setItem(TUTORIAL, "true");
