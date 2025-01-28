// This file is auto-generated; do not manually edit

export type Infrastructure = Crossing | BusStop | Link;

export interface Link {
  traffic?: traffic;
  cycling?: cycling;
}

export interface cycling {
  segregation_from_traffic?: segregation_from_traffic;
  cyclist_direction?: cyclist_direction;
  cycle_average_width?: number;
  parking_or_loading?: parking_or_loading;
}

export type parking_or_loading =
  | "none"
  | "yes without 0.5, buffer"
  | "yes with 0.5m buffer";

export type cyclist_direction = "single" | "bidirectional";

export type segregation_from_traffic =
  | none
  | traffic_reduction_or_quiet_route
  | "advisory lane"
  | "mandatory lane"
  | "light"
  | "stepped track"
  | "full"
  | "off-road";

export interface traffic_reduction_or_quiet_route {
  quiet_urban_street_without_centre_line?: boolean;
  has_speed_cushions?: boolean;
}

export interface none {
  quiet_urban_street_without_centre_line?: boolean;
  has_speed_cushions?: boolean;
}

export interface traffic {
  vehicles_per_day?: vehicles_per_day;
  peak_vehicles_per_hour?: peak_vehicles_per_hour;
  percent_hgvs?: percent_hgvs;
  speed_85_percentile?: number;
}

export type percent_hgvs = "<2%" | "2-5%" | ">5%";

export type peak_vehicles_per_hour = "<200" | "200-500" | "500-1000" | ">1000";

export type vehicles_per_day = "<2500" | "2500-8000" | ">8000";

export interface BusStop {
  treatment?: treatment;
}

export type treatment = "none" | "border" | "bypass";

export interface Crossing {
  traffic_lanes_to_cross?: number;
  required_crossing_speed?: number;
  has_crossing_detectors?: boolean;
}
