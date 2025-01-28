// This file is auto-generated; do not manually edit

export type Infrastructure = Crossing | BusStop | Link;

export interface Link {
  protection_from_motor_vehicles?: protection_from_motor_vehicles;
  separation_between_cyclists_pedestrians?: separation_between_cyclists_pedestrians;
  proximity_to_highway?: proximity_to_highway;
  cyclist_direction?: cyclist_direction;
  side_of_road?: side_of_road;
  adequate_lighting?: boolean;
  surface_type?: surface_type;
  has_barriers_causing_dismount?: boolean;
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

export type surface_type = "bound and sealed" | "not treated";

export type side_of_road = "left" | "right";

export type cyclist_direction = "single direction" | "bidirectional";

export type proximity_to_highway = "alongside" | "off-road";

export type separation_between_cyclists_pedestrians =
  | "full physical separation"
  | "partial separation"
  | "no separation";

export type protection_from_motor_vehicles =
  | "advisory line"
  | "mandatory line"
  | "light segregation"
  | "full segregation";

export interface BusStop {
  interaction_between_pedestrians_cyclists?: interaction_between_pedestrians_cyclists;
}

export type interaction_between_pedestrians_cyclists =
  | "bus stop boarder"
  | "bus stop bypass"
  | "shared use";

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
