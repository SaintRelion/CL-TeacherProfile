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
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { User } from "@/models/user";

const DocumentsTab = ({ userId }: { userId: string }) => {
  const { useSelect: userSelect } = useDBOperationsLocked<User>("User");
  const { data: users } = userSelect({
    firebaseOptions: { filterField: "id", value: userId },
  });
  const user = users != undefined ? users[0] : null;

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
          <DocumentUpload userId={userId} />
        </DialogContent>
      </Dialog>

      {user && <DocumentExplorer user={user} />}
    </div>
  );
};
export default DocumentsTab;
