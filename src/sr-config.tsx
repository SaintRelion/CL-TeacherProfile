import {
  setAuthAPIBaseUrl,
  setAuthLibClientAppName,
  setAuthLockRenderer,
  setAuthMode,
} from "@saintrelion/auth-lib";
import {
  setDALApiBaseUrl,
  setDALClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";
import { setShowQueryTypeOnLogs } from "@saintrelion/data-access-layer/dist/lib/helpers";
import AuthLockLoader from "./components/AuthLockLoader";

setShowQueryTypeOnLogs(false);

export const BASE_API = "https://api.teacherprofiling-kc.online/";
// AUTH-LIB
setAuthLibClientAppName("teacherprofile");
setAuthAPIBaseUrl(`${BASE_API}api/auth/`);
setAuthMode("api-jwt");

setAuthLockRenderer(AuthLockLoader);

// DAL
setDALClientAppName("teacherprofile");
setDALApiBaseUrl(`${BASE_API}api/`);
setGlobalMode("api");
