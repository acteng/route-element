// This file is auto-generated; do not manually edit

export type Crossing =
  | Bridge
  | Parallel
  | ped_x
  | pegasus
  | pelican
  | puffin
  | toucan
  | uncontrolled
  | "Underpass"
  | zebra;

export interface zebra {
  context3?: context3;
  crossing_details?: crossing_details;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface includes_placemaking {
  pocket_parks?: boolean;
  new_social_spaces?: boolean;
  greening?: boolean;
  community_gardens?: boolean;
  wayfinding?: boolean;
  art?: boolean;
  landscaping?: boolean;
  other?: string;
}

export interface vehicle_traffic {
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export interface crossing_details {
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
}

export type context3 = "at road junction" | "on road side" | standalone;

export interface standalone {
  fulfills_single_movement_desire_line?: boolean;
  fulfills_routing_desire_line?: boolean;
  provides_connection_to_bus_stop?: boolean;
}

export interface uncontrolled {
  context3?: context3;
  crossing_details?: crossing_details;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface toucan {
  context?: context;
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export type context = "at road junction" | "standalone";

export interface puffin {
  context?: context;
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface pelican {
  context?: context;
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface pegasus {
  context?: context;
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface ped_x {
  context?: context;
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface Parallel {
  context2?: context2;
  crossing_details?: crossing_details;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export type context2 = "at road junction" | standalone;

export interface Bridge {
  includes_placemaking?: includes_placemaking;
}
