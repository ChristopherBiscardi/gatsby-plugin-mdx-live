import system from "system-components/emotion";

const Code = system(
  {
    is: "code",
    fontSize: 1,
    fontFamily: "mono"
  },
  "fontFamily",
  "space",
  "color"
);
Code.displayName = "Code";

export default Code;
