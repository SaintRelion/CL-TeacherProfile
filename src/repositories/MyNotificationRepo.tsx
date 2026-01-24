import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "mynotification",
  endpoint: "mynotification/",
  store: "MyNotification",
});
