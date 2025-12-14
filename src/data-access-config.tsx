import { setAuthLibClientAppName } from "@saintrelion/auth-lib";
import {
  setDataAccessLayerClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";
import { setShowQueryTypeOnLogs } from "@saintrelion/data-access-layer/dist/lib/helpers";

setShowQueryTypeOnLogs(false);
setAuthLibClientAppName("teacherprofile");
setDataAccessLayerClientAppName("teacherprofile");
setGlobalMode("firebase");
