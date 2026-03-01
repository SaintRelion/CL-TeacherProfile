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

export const BASE_API =
  "http://uog0gwc84go00wso8scsww4w.76.13.217.76.sslip.io/";
// AUTH-LIB
setAuthLibClientAppName("teacherprofile");
setAuthAPIBaseUrl(`${BASE_API}api/auth/`);
setAuthMode("api-jwt");

// DAL
setDALClientAppName("teacherprofile");
setDALApiBaseUrl(`${BASE_API}api/`);
setGlobalMode("api");
