import { useLocation } from "react-router-dom";
import { useCurrentUser } from "@saintrelion/auth-lib";
import type { User } from "@/models/user";
import { RenderForm } from "@saintrelion/forms";
import DocumentExplorer from "@/components/archived-repository/DocumentExplorer";

const ArchivedRepositoryPage = () => {
  const user = useCurrentUser<User>();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") ?? "";
  const folder = params.get("folder") ?? "";

  return (
    <RenderForm wrapperClassName="flex-1 p-6 bg-slate-50 ">
      <DocumentExplorer user={user} initialSearch={q} initialFolder={folder} />
    </RenderForm>
  );
};
export default ArchivedRepositoryPage;
