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

export const BASE_API = "http://127.0.0.1:8000/";
// AUTH-LIB
setAuthLibClientAppName("teacherprofile");
setAuthAPIBaseUrl(`${BASE_API}api/auth/`);
setAuthMode("api-jwt");

// DAL
setDALClientAppName("teacherprofile");
setDALApiBaseUrl(`${BASE_API}api/`)
setGlobalMode("api");
