import type { CheckboxInput, Field } from "./types";

function bool(name: string): CheckboxInput {
  return { name, type: "checkbox" };
}

export function crossingSchema(): Field {
  // TODO No placemaking questions
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

  let checkboxes = [
    bool("has_pedestrian_refuge"),
    bool("is_setback"),
    bool("has_raised_table"),
    bool("has_buildout"),
  ];

  let vehicle = [
    { name: "vehicle_85p_speed", type: "number" },
    { name: "vehicle_flow_daily", type: "number" },
    { name: "vehicle_flow_peak_hour", type: "number" },
  ];

  let commonMembers = [
    {
      name: "context",
      // TODO dont need to know more questions?
      oneOf: ["at road junction", "standalone"],
    },
    ...checkboxes,
    { name: "crossing_speed", type: "number" },
    ...vehicle,
  ];

  return {
    name: "Crossing",
    oneOf: [
      "Bridge",
      {
        name: "Parallel",
        members: [twoContexts, ...checkboxes, ...vehicle],
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
        members: [threeContexts, ...checkboxes, ...vehicle],
      },
      "Underpass",
      {
        name: "zebra",
        members: [threeContexts, ...checkboxes, ...vehicle],
      },
    ],
  };
}
