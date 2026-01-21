import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "documentfolder",
  endpoint: "documentfolder/",
  store: "DocumentFolder",
});
