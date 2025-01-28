import type { CheckboxInput, Enum, Field, Struct } from "./types";

function bool(name: string): CheckboxInput {
  return { name, type: "checkbox" };
}

export function infraSchema(): Field {
  return {
    name: "Infrastructure",
    oneOf: [crossingSchema(), busStopSchema(), linkSchema()],
  };
}

let placemaking = {
  name: "includes_placemaking",
  members: [
    bool("pocket_parks"),
    bool("new_social_spaces"),
    bool("greening"),
    bool("community_gardens"),
    bool("wayfinding"),
    bool("art"),
    bool("landscaping"),
    { name: "other", type: "one-liner" },
  ],
};

function crossingSchema(): Enum {
  let twoContexts = {
    name: "context2",
    oneOf: [
      "at road junction",
      {
        name: "standalone",
        members: [
          bool("fulfills_single_movement_desire_line"),
          bool("fulfills_routing_desire_line"),
          bool("provides_connection_to_bus_stop"),
        ],
      },
    ],
  };
  let threeContexts = {
    name: "context3",
    oneOf: [
      "at road junction",
      "on road side",
      {
        name: "standalone",
        members: [
          bool("fulfills_single_movement_desire_line"),
          bool("fulfills_routing_desire_line"),
          bool("provides_connection_to_bus_stop"),
        ],
      },
    ],
  };

  let checkboxes = {
    name: "crossing_details",
    members: [
      bool("has_pedestrian_refuge"),
      bool("is_setback"),
      bool("has_raised_table"),
      bool("has_buildout"),
    ],
  };

  let vehicle = {
    name: "vehicle_traffic",
    members: [
      { name: "vehicle_85p_speed", type: "number" },
      { name: "vehicle_flow_daily", type: "number" },
      { name: "vehicle_flow_peak_hour", type: "number" },
    ],
  };

  let commonMembers = [
    {
      name: "context",
      // TODO dont need to know more questions?
      oneOf: ["at road junction", "standalone"],
    },
    checkboxes,
    { name: "crossing_speed", type: "number" },
    vehicle,
    placemaking,
  ];

  return {
    name: "Crossing",
    oneOf: [
      {
        name: "Bridge",
        members: [placemaking],
      },
      {
        name: "Parallel",
        members: [twoContexts, checkboxes, vehicle, placemaking],
      },
      {
        name: "ped_x",
        members: commonMembers,
      },
      {
        name: "pegasus",
        members: commonMembers,
      },
      {
        name: "pelican",
        members: commonMembers,
      },
      {
        name: "puffin",
        members: commonMembers,
      },
      {
        name: "toucan",
        members: commonMembers,
      },
      {
        name: "uncontrolled",
        members: [threeContexts, checkboxes, vehicle, placemaking],
      },
      "Underpass",
      {
        name: "zebra",
        members: [threeContexts, checkboxes, vehicle, placemaking],
      },
    ],
  };
}

function busStopSchema(): Struct {
  return {
    name: "BusStop",
    members: [
      {
        name: "interaction_between_pedestrians_cyclists",
        oneOf: ["bus stop boarder", "bus stop bypass", "shared use"],
      },
    ],
  };
}

function linkSchema(): Struct {
  return {
    name: "Link",
    members: [
      {
        name: "protection_from_motor_vehicles",
        oneOf: [
          "advisory line",
          "mandatory line",
          "light segregation",
          "full segregation",
        ],
      },
      {
        name: "separation_between_cyclists_pedestrians",
        oneOf: [
          "full physical separation",
          "partial separation",
          "no separation",
        ],
      },
      {
        name: "proximity_to_highway",
        // TODO If off-road, then protection_from_motor_vehicles and side_of_road is irrelevant
        oneOf: ["alongside", "off-road"],
      },
      {
        name: "cyclist_direction",
        oneOf: ["single direction", "bidirectional"],
      },
      {
        name: "side_of_road",
        oneOf: ["left", "right"],
      },
      bool("adequate_lighting"),
      {
        name: "surface_type",
        oneOf: ["bound and sealed", "not treated"],
      },
      bool("has_barriers_causing_dismount"),
      placemaking,
    ],
  };
}
