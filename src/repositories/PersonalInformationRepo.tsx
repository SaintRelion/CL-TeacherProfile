import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "personalinformation",
  endpoint: "personalinformation/",
  store: "PersonalInformation",
});
