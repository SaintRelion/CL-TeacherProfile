import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "personalinformation",
  endpoint: "personalinformation/",
  store: "PersonalInformation",
});

registerResource({
  name: "inspect_personalinformation",
  endpoint: "inspect_personalinformation/",
  store: "PersonalInformation",
});
