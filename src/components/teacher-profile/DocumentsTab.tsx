import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Document } from "@/models/document";

import DocumentsCard from "@/components/teacher-profile/DocumentCard";
import DocumentUpload from "@/components/teacher-profile/DocumentUpload";
import { useDBOperations } from "@saintrelion/data-access-layer";

const DocumentsTab = () => {
  const { useSelect: documentSelect } = useDBOperations<Document>("Document");

  const { data: allDocuments } = documentSelect({});
  console.log(allDocuments);

  const personalDocuments = allDocuments?.filter(
    (v) => v.documentType == "personal",
  );
  const professionalDocuments = allDocuments?.filter(
    (v) => v.documentType == "professional",
  );

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
                  Drag and drop files here
                </p>
                <p className="text-secondary-600">or click to browse files</p>
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
          <DocumentUpload />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h5 className="text-secondary-900 mb-3 font-semibold">
            Personal Documents
          </h5>
          <div className="space-y-3">
            {personalDocuments?.map((value, index) => (
              <DocumentsCard key={index} document={value} />
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-secondary-900 mb-3 font-semibold">
            Professional Documents
          </h5>
          <div className="space-y-3">
            {professionalDocuments?.map((value, index) => (
              <DocumentsCard key={index} document={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DocumentsTab;
