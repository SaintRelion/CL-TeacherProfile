import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "documenttypes",
  endpoint: "documenttypes/",
  store: "DocumentTypes",
});
