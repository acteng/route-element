import {
  bool,
  emptyStruct,
  type Field,
  type ObjectEnum,
  type Struct,
} from "./types";

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

function crossingSchema(): ObjectEnum {
  let twoContexts = {
    name: "context2",
    oneOf: [
      emptyStruct("at_road_junction"),
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
      emptyStruct("at_road_junction"),
      emptyStruct("on_road_side"),
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
      cases: ["at road junction", "standalone"],
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
      emptyStruct("Underpass"),
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
        cases: ["bus stop boarder", "bus stop bypass", "shared use"],
      },
    ],
  };
}

function linkSchema(): Struct {
  let sideOfRoad = {
    name: "side_of_road",
    cases: ["left", "right"],
  };
  let direction = {
    name: "cyclist_direction",
    cases: ["single direction", "bidirectional"],
  };
  let surfaceType = {
    name: "surface_type",
    cases: ["bound and sealed", "not treated"],
  };
  let lighting = bool("adequate_lighting");
  let dismount = bool("has_barriers_causing_dismount");
  let proximityToHighway = {
    name: "proximity_to_highway",
    cases: ["alongside", "off-road"],
  };

  return {
    name: "Link",
    members: [
      { name: "length", type: "number" },
      { name: "width", type: "number" },
      {
        name: "kind",
        oneOf: [
          {
            name: "cycle_lane_on_road",
            members: [
              {
                // TODO light and full cases aren't possible for a lane
                name: "protection_from_motor_vehicles",
                cases: ["advisory line", "mandatory line"],
              },
              sideOfRoad,
              lighting,
              placemaking,
            ],
          },
          {
            name: "shared_bus_lane",
            members: [sideOfRoad, lighting, placemaking],
          },
          {
            name: "no_active_travel_provision",
            members: [sideOfRoad],
          },
          {
            name: "pavement_widening",
            members: [sideOfRoad, placemaking],
          },
          {
            name: "quiet_route",
            members: [
              {
                name: "separation_between_cyclists_pedestrians",
                // TODO partial separation with pedestrians not possible for this case?
                cases: ["full physical separation", "no separation"],
              },
              direction,
              lighting,
              dismount,
              placemaking,
            ],
          },
          {
            name: "shared_use_route",
            members: [
              {
                name: "separation_between_cyclists_pedestrians",
                cases: ["partial separation", "no separation"],
              },
              proximityToHighway,
              direction,
              lighting,
              surfaceType,
              dismount,
              sideOfRoad,
              placemaking,
            ],
          },
          {
            name: "stepped_cycletrack_along_road",
            members: [
              direction,
              lighting,
              surfaceType,
              // TODO dismount relevant here?
              dismount,
              sideOfRoad,
              placemaking,
            ],
          },
          {
            name: "walking_wheeling_only_route",
            members: [
              proximityToHighway,
              lighting,
              surfaceType,
              sideOfRoad,
              placemaking,
            ],
          },
        ],
      },
    ],
  };
}
