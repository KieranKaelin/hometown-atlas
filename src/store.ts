import { create } from "zustand";
import { LatLng, LatLngExpression } from "leaflet";
import { fetchRoads } from "./overpass.js";
import { getLastSelection, setLastSelection } from "./constants";
import jaroWinkler from "jaro-winkler";

const DISTANCE_THRESHOLD = 0.985;

type Road = {
  name: string;
  positions: LatLngExpression[][];
  state: "correct" | "wrong" | "pending" | "current";
};

type State = {
  isPlaying: boolean;
  isFinished: boolean;
  startDate: Date;
  endDate: Date;
  wrongGuesses: number;
  roads: Road[];
  selection: LatLngExpression[];
  setSelection: (selection: [number, number][]) => void;
  startGame: () => Promise<void>;
  cancelGame: () => void;
  submitGuess: (value: string) => { result: boolean; road: string };
};

export const useStore = create<State>()((set, get) => ({
  isPlaying: false,
  isFinished: false,
  startDate: new Date(),
  endDate: new Date(),
  wrongGuesses: 0,
  roads: [],
  selection: getLastSelection(),
  setSelection: (selection: [number, number][]) => {
    setLastSelection(selection);
    set(() => ({ selection }));
  },
  startGame: async () => {
    const raw = await fetchRoads(get().selection);

    const roadsObject: Record<string, Road> = {};
    for (const road of raw.elements) {
      const name = road.tags!.name;
      roadsObject[name] ??= { name, state: "pending", positions: [] };
      roadsObject[name].positions.push([
        road.geometry.map((point) => new LatLng(point.lat, point.lon)),
      ]);
    }
    let roads = Object.values(roadsObject);

    // TODO: Show an error if there are no roads

    // Shuffle the roads
    roads = roads
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // Choose the current road
    roads[random(roads.length - 1)].state = "current";

    set(() => ({
      isPlaying: true,
      isFinished: false,
      startDate: new Date(),
      endDate: new Date(),
      wrongGuesses: 0,
      roads,
    }));
  },
  cancelGame: () =>
    set(() => ({
      isPlaying: false,
      isFinished: false,
      roads: [],
      selection: getLastSelection(),
    })),
  submitGuess: (value) => {
    let result = false;
    let roadName = "";
    set(({ roads, wrongGuesses }) => {
      const road = get().roads.find((road) => road.state === "current")!;
      roadName = road.name;

      const expect = normalizeString(roadName);
      const guess = normalizeString(value);

      result = jaroWinkler(expect, guess) >= DISTANCE_THRESHOLD;
      road.state = result ? "correct" : "wrong";

      const pendingRoads = roads.filter((road) => road.state !== "correct");

      if (pendingRoads.length === 0) {
        return {
          isFinished: true,
          endDate: new Date(),
          roads: [...roads],
        };
      } else {
        pendingRoads[random(pendingRoads.length - 1)].state = "current";

        return {
          roads: [...roads],
          wrongGuesses: wrongGuesses + (result ? 0 : 1),
        };
      }
    });
    return { result, road: roadName };
  },
}));

export const random = (max: number) => Math.floor(Math.random() * max);

const normalizeString = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replaceAll("ü", "u")
    .replaceAll("ß", "ss");
