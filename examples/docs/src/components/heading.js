import system from "system-components/emotion";

const Heading = system(
  {
    is: "h2",
    fontSize: 5,
    fontWeight: "bold",
    lineHeight: 1.25,
    mt: 4,
    mb: 3
  },
  "fontFamily",
  "color",
  "textAlign"
);
Heading.displayName = "Heading";

export default Heading;
