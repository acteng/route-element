// This file is auto-generated; do not manually edit

export type Infrastructure = Crossing | BusStop | Link;

export interface Link {
  length?: number;
  width?: number;
  kind?: kind;
}

export type kind =
  | cycle_lane_on_road
  | shared_bus_lane
  | no_active_travel_provision
  | pavement_widening
  | quiet_route
  | shared_use_route
  | stepped_cycletrack_along_road
  | walking_wheeling_only_route;

export interface walking_wheeling_only_route {
  proximity_to_highway?: "alongside" | "off-road";
  adequate_lighting?: boolean;
  surface_type?: "bound and sealed" | "not treated";
  side_of_road?: "left" | "right";
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

export interface stepped_cycletrack_along_road {
  cyclist_direction?: "single direction" | "bidirectional";
  adequate_lighting?: boolean;
  surface_type?: "bound and sealed" | "not treated";
  has_barriers_causing_dismount?: boolean;
  side_of_road?: "left" | "right";
  includes_placemaking?: includes_placemaking;
}

export interface shared_use_route {
  separation_between_cyclists_pedestrians?:
    | "partial separation"
    | "no separation";
  proximity_to_highway?: "alongside" | "off-road";
  cyclist_direction?: "single direction" | "bidirectional";
  adequate_lighting?: boolean;
  surface_type?: "bound and sealed" | "not treated";
  has_barriers_causing_dismount?: boolean;
  side_of_road?: "left" | "right";
  includes_placemaking?: includes_placemaking;
}

export interface quiet_route {
  separation_between_cyclists_pedestrians?:
    | "full physical separation"
    | "no separation";
  cyclist_direction?: "single direction" | "bidirectional";
  adequate_lighting?: boolean;
  has_barriers_causing_dismount?: boolean;
  includes_placemaking?: includes_placemaking;
}

export interface pavement_widening {
  side_of_road?: "left" | "right";
  includes_placemaking?: includes_placemaking;
}

export interface no_active_travel_provision {
  side_of_road?: "left" | "right";
}

export interface shared_bus_lane {
  side_of_road?: "left" | "right";
  adequate_lighting?: boolean;
  includes_placemaking?: includes_placemaking;
}

export interface cycle_lane_on_road {
  protection_from_motor_vehicles?: "advisory line" | "mandatory line";
  side_of_road?: "left" | "right";
  adequate_lighting?: boolean;
  includes_placemaking?: includes_placemaking;
}

export interface BusStop {
  interaction_between_pedestrians_cyclists?:
    | "bus stop boarder"
    | "bus stop bypass"
    | "shared use";
}

export type Crossing =
  | Bridge
  | Parallel
  | ped_x
  | pegasus
  | pelican
  | puffin
  | toucan
  | uncontrolled
  | Underpass
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

export type context3 = at_road_junction | on_road_side | standalone;

export interface standalone {
  fulfills_single_movement_desire_line?: boolean;
  fulfills_routing_desire_line?: boolean;
  provides_connection_to_bus_stop?: boolean;
}

export interface on_road_side {}

export interface at_road_junction {}

export interface Underpass {}

export interface uncontrolled {
  context3?: context3;
  crossing_details?: crossing_details;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface toucan {
  context?: "at road junction" | "standalone";
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface puffin {
  context?: "at road junction" | "standalone";
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface pelican {
  context?: "at road junction" | "standalone";
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface pegasus {
  context?: "at road junction" | "standalone";
  crossing_details?: crossing_details;
  crossing_speed?: number;
  vehicle_traffic?: vehicle_traffic;
  includes_placemaking?: includes_placemaking;
}

export interface ped_x {
  context?: "at road junction" | "standalone";
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

export type context2 = at_road_junction | standalone;

export interface Bridge {
  includes_placemaking?: includes_placemaking;
}
