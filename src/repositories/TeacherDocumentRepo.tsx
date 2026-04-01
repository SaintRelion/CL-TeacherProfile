import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "teacherdocument",
  endpoint: "teacherdocument/",
  store: "TeacherDocument",
});

registerResource({
  name: "teacherdocumentfile",
  endpoint: "teacherdocumentfile/",
  store: "TeacherDocument",
});
