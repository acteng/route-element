// This file is auto-generated; do not manually edit

export type Crossing =
  | "Bridge"
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
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export type context3 = "at road junction" | "on road side" | standalone;

export interface standalone {
  fulfills_single_movement_desire_line?: boolean;
  fulfills_routing_desire_line?: boolean;
  provides_connection_to_bus_stop?: boolean;
}

export interface uncontrolled {
  context3?: context3;
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export interface toucan {
  context?: context;
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
  crossing_speed?: number;
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export type context = "at road junction" | "standalone";

export interface puffin {
  context?: context;
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
  crossing_speed?: number;
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export interface pelican {
  context?: context;
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
  crossing_speed?: number;
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export interface pegasus {
  context?: context;
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
  crossing_speed?: number;
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export interface ped_x {
  context?: context;
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
  crossing_speed?: number;
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export interface Parallel {
  context2?: context2;
  has_pedestrian_refuge?: boolean;
  is_setback?: boolean;
  has_raised_table?: boolean;
  has_buildout?: boolean;
  vehicle_85p_speed?: number;
  vehicle_flow_daily?: number;
  vehicle_flow_peak_hour?: number;
}

export type context2 = "at road junction" | standalone;
