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
import type { User } from "@/models/user";
import type { PersonalInformation } from "@/models/PersonalInformation";
import { useState } from "react";

const DocumentsTab = ({ userId }: { userId: string }) => {
  const { useList: getUsers } = useResourceLocked<User>("user");
  const users = getUsers({
    filters: { id: userId },
  }).data;
  const user = users && users.length > 0 ? users[0] : null;

  const { useList: getInformation } = useResourceLocked<PersonalInformation>(
    "personalinformation",
  );
  const informations = getInformation({
    filters: {
      user: userId,
    },
  }).data;

  const myInformation =
    informations && informations.length > 0 ? informations[0] : undefined;

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  return (
    <div>
      <h4 className="mb-6 text-lg font-semibold text-gray-900">
        Document Repository
      </h4>

      <Dialog
        onOpenChange={(open) => {
          if (!open) setUploadedFileName(null);
        }}
      >
        <DialogTrigger className="w-full">
          <div className="mb-6 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50">
            <div className="space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <i className="fas fa-cloud-upload-alt text-2xl text-blue-600"></i>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Click to upload files
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="mx-auto w-full max-w-sm rounded-lg bg-white p-6 shadow-lg transition-all duration-300 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 sm:text-3xl">
              {uploadedFileName ? (
                uploadedFileName
              ) : (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                  Waiting for file…
                </span>
              )}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {user != undefined && (
            <DocumentUpload
              userId={userId}
              fullName={
                myInformation != undefined
                  ? `${myInformation.first_name} ${myInformation.middle_name} ${myInformation.last_name}`
                  : `Username: ${user.username}`
              }
              onFileSelect={(name) => setUploadedFileName(name)}
            />
          )}
        </DialogContent>
      </Dialog>

      {user && <DocumentExplorer user={user} />}
    </div>
  );
};
export default DocumentsTab;
