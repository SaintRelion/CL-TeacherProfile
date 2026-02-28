import {
  setAuthAPIBaseUrl,
  setAuthLibClientAppName,
  setAuthMode,
} from "@saintrelion/auth-lib";
import {
  setDALApiBaseUrl,
  setDALClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";
import { setShowQueryTypeOnLogs } from "@saintrelion/data-access-layer/dist/lib/helpers";

setShowQueryTypeOnLogs(false);

export const BASE_API = "127.0.0.1";
// AUTH-LIB
setAuthLibClientAppName("teacherprofile");
setAuthAPIBaseUrl(`http://${BASE_API}:8000/api/auth/`);
setAuthMode("api-jwt");

// DAL
setDALClientAppName("teacherprofile");
setDALApiBaseUrl(`http://${BASE_API}:8000/api/`)
setGlobalMode("api");
