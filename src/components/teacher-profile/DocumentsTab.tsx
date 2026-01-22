import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import DocumentUpload from "@/components/teacher-profile/DocumentUpload";
import DocumentExplorer from "../document-repository/DocumentExplorer";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { User } from "@/models/User";
import type { PersonalInformation } from "@/models/PersonalInformation";

const DocumentsTab = ({ userId }: { userId: string }) => {
  const { useList: getUsers } = useResourceLocked<User>("user");
  const users = getUsers({
    filters: { id: userId },
  }).data;
  const user = users.length > 0 ? users[0] : null;

  const { useList: getInformation } = useResourceLocked<PersonalInformation>(
    "personalinformation",
  );
  const informations = getInformation({
    filters: {
      userId: userId,
    },
  }).data;

  const myInformation = informations.length > 0 ? informations[0] : undefined;

  return (
    <div>
      <h4 className="text-secondary-900 mb-6 text-lg font-semibold">
        Document Repository
      </h4>

      <Dialog>
        <DialogTrigger className="w-full">
          <div className="hover:border-primary-400 hover:bg-primary-50 mb-6 cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors">
            <div className="space-y-3">
              <div className="bg-primary-100 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <i className="fas fa-cloud-upload-alt text-primary-600 text-2xl"></i>
              </div>
              <div>
                <p className="text-secondary-900 text-lg font-medium">
                  Click to upload files
                </p>
              </div>
              <p className="text-secondary-500 text-sm">
                Supports PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="mx-auto w-full max-w-sm rounded-lg bg-white p-6 shadow-lg transition-all duration-300 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 sm:text-3xl">
              Document License Form
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {myInformation != undefined && user != undefined && (
            <DocumentUpload
              userId={userId}
              role={user.roles?.[0] ?? ""}
              fullName={`${myInformation.firstName} ${myInformation.middleName} ${myInformation.lastName}`}
            />
          )}
        </DialogContent>
      </Dialog>

      {user && <DocumentExplorer user={user} />}
    </div>
  );
};
export default DocumentsTab;
