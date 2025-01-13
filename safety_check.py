# This is a quick variation of a script in https://github.com/acteng/inspectorate_tools/tree/main/codegen
import csv

with open("web/src/rc/links/metrics.ts", "w") as f:
    f.write("export let metrics = {\n")

    with open(
        "/home/dabreegster/inspectorate_tools/codegen/inputs/safety-check.csv"
    ) as inputFile:
        for row in csv.DictReader(
            inputFile,
            fieldnames=[
                "Metric",
                "Mode",
                "ID",
                "Description",
                "Critical",
                "Red",
                "Amber",
                "Green",
            ],
        ):
            if not row["Mode"]:
                continue

            f.write("  " + row["ID"] + ": {\n")
            f.write("""    description: `{}`,\n""".format(row["Description"]))
            f.write("""    green: `{}`,\n""".format(row["Green"]))
            f.write("""    amber: `{}`,\n""".format(row["Amber"]))
            f.write("""    red: `{}`,\n""".format(row["Red"]))
            f.write("""    critical: `{}`,\n""".format(row["Critical"]))
            f.write("  },\n")

    f.write("};\n")
