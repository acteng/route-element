export interface Metric {
  description: string;
  green: string;
  amber: string;
  red: string;
  critical: string;
}

export let metrics: { [name: string]: Metric } = {
  SA01: {
    description: `Pedestrian and cyclist conflict with motor traffic at side roads/priority junctions`,
    green: `Side roads/priority junctions have entry treatments that offer greater protection for  pedestrian and cycle movements (e.g. exit only, continuous footways, zebra/parallel crossings as appropriate to context).`,
    amber: `<2,500vpd cut across main walking, wheeling or cycling streams and side roads and priority junctions have entry treatments. `,
    red: `<2,500vpd cut across main walking, wheeling or cycling streams, but side roads and priority junctions are untreated.`,
    critical: `>2,500vpd cut across main walking, wheeling or cycling streams.`,
  },
  SA02: {
    description: `Pedestrian and cyclist conflict with motor traffic at roundabouts and signal-controlled junctions`,
    green: `All pedestrian and cyclist movements are separated from all motor traffic movements at roundabouts and/or signal controlled junctions.`,
    amber: `The principal pedestrian and cyclist movements are separated from motor traffic movements at roundabouts and/or signal controlled junctions.`,
    red: `The principal pedestrian and/or cyclist movements are in conflict with motor traffic movements at roundabouts and/or signal controlled junctions.`,
    critical: `>2,500vpd cut across main walking, wheeling or cycling streams.`,
  },
  SA03: {
    description: `Effect of lane widths on conflict between cyclists and motor traffic`,
    green: `Cyclists are protected from motor traffic or off-road entirely.`,
    amber: `Cyclists are in cycle lanes with light protection or stepped cycle tracks under 1.8m wide (single direction).

Or, cyclists are in a protected bidirectional cycle facility under 2.5m wide.

Or, cyclists are mixed with traffic on quiet urban streets with no centre line.`,
    red: `Cyclists are mixed with traffic in lanes less than 3.25m wide or over 3.9m wide.

Or, cyclists are in unprotected cycle lanes and the combined width of the cycle lane and adjacent traffic lane is under 3.25m or over 3.9m. 

Or cyclists are mixed with traffic on busy urban streets with no centre line.

Or, there are speed cushions present.`,
    critical: `Cyclists are mixed with traffic in lanes between 3.25m and 3.9m wide. 

Or, cyclists are in unprotected cycle lanes and the combined width of the cycle lane and adjacent traffic lane is between 3.25m and 3.9m.`,
  },
  SA04: {
    description: `Risk of pedestrians tripping due to hazards`,
    green: `No trip hazards, level clear surface.`,
    amber: `Few trip hazards.`,
    red: `Many trip hazards.`,
    critical: `There are level differences of greater than 13mm with no tactile information and colour contrast to help identify them.`,
  },
  SA05: {
    description: `Cyclist conflict with kerbside activity, including risk of 'dooring' `,
    green: `Kerbside activity is well-managed with no or minimal conflict with cyclists. `,
    amber: `Less frequent kerbside activity, and conflict with cyclists is well-managed.`,
    red: `Frequent kerbside activity for cyclists to contend with. Conflict with cyclists is not well-managed.`,
    critical: `Cycle facility next to parking/loading facility, without a buffer of at least 0.5m.

Or, an unprotected cycle lane is next to a frequently-used bus layby.`,
  },
  SA06: {
    description: `Ability of pedestrians to cross the street safely on desire lines`,
    green: `On very busy streets (>8,000vpd), controlled crossings (including zebra crossings) are provided every 50-100m. 

On quieter streets (<8,000vpd), there are controlled crossings or only one lane of traffic to cross.`,
    amber: `On very busy streets (>8,000vpd), controlled crossings (including zebra crossings) are provided every 100-200m.

On quieter streets (<8,000vpd), loading/parking is formalised with gaps for pedestrians to cross on desire lines.`,
    red: `On very busy streets (>8,000vpd), controlled crossings (including zebra crossings) are provided every 200-400m.

On quieter streets (<8,000vpd), loading/parking is formalised with gaps for pedestrians to cross.`,
    critical: `On very busy streets (>8,000vpd) controlled crossings (including zebra crossings) are not present or more than 400m apart.

On quieter streets (<8,000vpd), desire lines are blocked by parking and loading. `,
  },
  SA07: {
    description: `Suitability of pedestrian crossings in context`,
    green: `On very busy streets (>8,000vpd), signal crossings rest on green for pedestrians or have rapid response.

On quieter streets (<8,000vpd), crossing points are controlled crossings.`,
    amber: `On very busy streets (>8,000vpd), signal crossings are provided for pedestrians.

On quieter streets (<8,000vpd), crossing points have effective implied priority for pedestrians.`,
    red: `On very busy streets (>8,000vpd), there are uncontrolled crossings or zebra/parallel crossings.

On quieter streets (<8,000vpd), crossing points have no implied priority or there are no crossing points.`,
    critical: `On very busy streets (>8,000vpd), there are uncontrolled crossings of two or more lanes with no gaps in traffic.

At signal junctions there are arms with dropped kerbs and tactile paving but no green pedestrian symbol.`,
  },
  SA08: {
    description: `85th percentile speed of motor traffic (where cyclists are not protected or pedestrians are crossing uncontrolled)`,
    green: `85th percentile speed is under 20mph.

Or, cyclists are protected from motor traffic or off-road entirely and controlled crossings are provided for pedestrians wherever needed.`,
    amber: `85th percentile speed is between 20mph and 25mph.`,
    red: `85th percentile speed is over 25mph.`,
    critical: `85th percentile speed is over 30mph.`,
  },
  SA09: {
    description: `Volume of motor traffic at the busiest hour (where cyclists are not protected or pedestrians cross uncontrolled)`,
    green: `<200 vehicles in the busiest hour.

Or, cyclists are protected from motor traffic or off-road entirely and controlled crossings are provided for pedestrians wherever needed.`,
    amber: `200-499 vehicles in the busiest hour.

And, less than 2% of traffic is HGVs.`,
    red: `500-1,000 vehicles in the busiest hour.

Or, 2-5% of traffic is HGVs where there are 200-499 vehicles in the busiest hour.`,
    critical: `>1,000 vehicles in the busiest hour.

Or, over 5% of traffic is HGVs where there are over 500 vehicles in the busiest hour.`,
  },
  SA10: {
    description: `Required crossing speed at signal crossings (risk of pedestrians coming into conflict with traffic).`,
    green: `There are detectors present on the crossing which extend crossing times based on a crossing speed of 1m/s.`,
    amber: `There are detectors present on the crossing which extend crossing times based on a crossing speed of 1.2m/s.`,
    red: `There are no detectors to extend crossing times, but pedestrians who start crossing at the end of the 'invitation to cross' can cross at a speed of 1.2m/s and get across the whole crossing in time.`,
    critical: `Pedestrians who start crossing at the end of the 'invitation to cross' must cross at a speed of over 1.2m/s to get across the whole crossing in time.`,
  },
  SA11: {
    description: `Clear walking and wheeling spaces free of permanent obstructions and furniture, reducing risk of pedestrians walking in the carriageway.`,
    green: `>3m clear footway width and pedestrian comfort is good (PCL of A-C).`,
    amber: `Where the footway is next to the carriageway, there is:
• 2m-3m clear footway width and pedestrian comfort is good (PCL of A-C).
• >3m clear footway width and pedestrian comfort is poor (PCL of D-E).

Where the footway is not next to the carriageway, the clear footway width is 1.5m-3m.`,
    red: `Where the footway is next to the carriageway, there is:
• <2m clear footway width but pedestrian comfort is good (PCL of A-C)
• 2m-3m clear footway width and pedestrian comfort is poor (PCL of D-E).

Where the footway is not next to the carriageway, the clear footway width is <1.5m.`,
    critical: `Where the footway is next to the carriageway, there is:
• <1m clear footway width on any footway
• <1.5m clear footway width for over 6m
• 1m-2m clear footway width with a Pedestrian Comfort Level of D-E

Or there is no footway.`,
  },
  SA12: {
    description: `Effective width next to tram line on a straight run or a curve`,
    green: `Physical protection is provided for cyclists.`,
    amber: `>2.4m from tramline edge to kerb.`,
    red: `2.4m from tramline edge to kerb.`,
    critical: `<2.4m from tramline edge to kerb on a straight run.

Insufficient clearance on a curve.`,
  },
  SA13: {
    description: `Crossing angle (between cyclist desire line and tram or train rails).`,
    green: `Crossing angle between 80 and 90 degrees with track filler creating a smooth crossing for cyclists.`,
    amber: `Crossing angle between 80 and 90 degrees (or between 60 and 80 degrees with track filler creating a smooth crossing for cyclists).`,
    red: `Crossing angle between 60 and 80 degrees.`,
    critical: `Crossing angle less than 60 degrees.`,
  },
  SA14: {
    description: `Cycling surface and maintenance defects:
• sharp gradients (≥12.5%)
• non cycle friendly ironworks
• raised/sunken covers or gullies
• potholes
• loose/cracked surfaces
• poor drainage or slip risks
• overgrown vegetation`,
    green: `No defects.`,
    amber: `Few minor defects.`,
    red: `Many minor defects.`,
    critical: `Major defects.`,
  },
  SA15: {
    description: `Walking/wheeling surface and maintenance defects:
• steep camber (horizontal gradient >2.5% )
• steep longitudinal gradients (≥8% if under 1m, ≥5% if 1m or over) 
• missing dropped kerbs
• non flush tables
• misleading tactile information
• loose/cracked surfaces
• poor drainage or slip risks
• overgrown vegetation
`,
    green: `No defects.`,
    amber: `Few minor defects.`,
    red: `Many minor defects.`,
    critical: `Major defects.`,
  },
  SA16: {
    description: `Presence of guard railing`,
    green: `No guard railing anywhere on the route.`,
    amber: `Minimal guard railing, used to address a clear safety issue such as a level difference.`,
    red: `Guard railing used to control behaviour in complex environments.`,
    critical: `Guard railing used as standard without consideration of inherent safety risks.`,
  },

  ST20: {
    description: "Interactions at bus stops.",
    green:
      "At bus stops, cyclists are protected from buses and traffic and interactions between pedestrians and cyclists are likely to be low-level.",
    amber:
      "At bus stops, cyclists are protected from buses and traffic, but there are likely to be medium-level interactions between pedestrians and cyclists.",
    red: "At bus stops, cyclists regularly have to wait behind buses or overtake them in general traffic lanes. Or, there are likely to be high-level interactions between pedestrians and cyclists.",
    critical: "",
  },
};
