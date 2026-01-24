import {
  setAuthAPIBaseUrl,
  setAuthLibClientAppName,
  setAuthMode,
} from "@saintrelion/auth-lib";
import {
  setDALClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";
import { setShowQueryTypeOnLogs } from "@saintrelion/data-access-layer/dist/lib/helpers";

setShowQueryTypeOnLogs(false);

// AUTH-LIB
setAuthLibClientAppName("teacherprofile");
setAuthAPIBaseUrl("");
setAuthMode("firebase");

// DAL
setDALClientAppName("teacherprofile");
setGlobalMode("firebase");
