// geojson Position isn't right for us
export type Position = [number, number];

export function numId(id: string | number | undefined): number {
  return id as number;
}

export function scores(): string[] {
  return ["", "2", "1", "0", "Critical"];
}

// Vivid from https://carto.com/carto-colors/
export let colors = [
  "#66C5CC",
  "#F6CF71",
  "#F89C74",
  "#DCB0F2",
  "#87C55F",
  "#9EB9F3",
  "#FE88B1",
  "#C9DB74",
  "#8BE0A4",
  "#B497E7",
  "#D3B484",
  "#B3B3B3",
];
