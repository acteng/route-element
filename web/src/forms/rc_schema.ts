import { bool, emptyStruct, type Field, type Struct } from "./types";

export function rcSchema(): Field {
  return {
    name: "Infrastructure",
    oneOf: [crossingSchema(), busStopSchema(), linkSchema()],
  };
}

function crossingSchema(): Struct {
  return {
    name: "Crossing",
    members: [
      // TODO Maybe some of these could be enums
      {
        name: "traffic_lanes_to_cross",
        type: "number",
      },
      {
        name: "required_crossing_speed",
        type: "number",
      },
      // TODO only for some kinds
      bool("has_crossing_detectors"),
      // TODO kind
    ],
  };
}

function busStopSchema(): Struct {
  return {
    name: "BusStop",
    members: [
      {
        // TODO Conflates interaction with pedestrians and traffic?
        name: "treatment",
        cases: ["none", "border", "bypass"],
      },
      // TODO peak bus frequency -- but can't find in RC
    ],
  };
}

function linkSchema(): Struct {
  let noInfrastrutureContext = [
    bool("quiet_urban_street_without_centre_line"),
    bool("has_speed_cushions"),
  ];

  return {
    name: "Link",
    members: [
      // TODO if it's off-road, traffic questions could either 0 out or not be asked
      {
        name: "traffic",
        members: [
          {
            name: "vehicles_per_day",
            cases: ["<2500", "2500-8000", ">8000"],
          },
          {
            name: "peak_vehicles_per_hour",
            cases: ["<200", "200-500", "500-1000", ">1000"],
          },
          {
            name: "percent_hgvs",
            cases: ["<2%", "2-5%", ">5%"],
          },
          {
            name: "speed_85_percentile",
            type: "number",
          },
        ],
      },
      {
        name: "cycling",
        members: [
          {
            name: "segregation_from_traffic",
            // TODO off-road here, or have a separate bit of context up-front?
            oneOf: [
              { name: "none", members: noInfrastrutureContext },
              {
                name: "traffic_reduction_or_quiet_route",
                members: noInfrastrutureContext,
              },
              emptyStruct("advisory_lane"),
              emptyStruct("mandatory_lane"),
              emptyStruct("light"),
              emptyStruct("stepped_track"),
              emptyStruct("full"),
              emptyStruct("off_road"),
            ],
          },
          {
            name: "cyclist_direction",
            cases: ["single", "bidirectional"],
          },
          {
            // TODO average, min, or max?
            // TODO irrelevant based on segregation_from_traffic
            name: "cycle_average_width",
            type: "number",
          },
          {
            name: "parking_or_loading",
            cases: ["none", "yes without 0.5, buffer", "yes with 0.5m buffer"],
          },
        ],
      },
    ],
  };
}
