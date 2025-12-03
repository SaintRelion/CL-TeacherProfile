import type { Document } from "@/models/document";

const DocumentsCard = ({ document }: { document: Document }) => {
  return (
    <div
      className={`${parseInt(document.expiryDate) != -1 ? "hover:bg-slate-50" : "bg-warning-50 hover:bg-warning-100"} flex items-center justify-between rounded-lg border border-slate-200 p-3`}
    >
      <div className="flex items-center space-x-3">
        <div className={`${document.iconBackgroundColor} rounded p-2`}>
          <i className={document.iconClassName}></i>
        </div>
        <div>
          <p className="text-secondary-900 font-medium">
            {document.documentName}
          </p>
          <p className="text-secondary-600 text-sm">{document.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="text-secondary-600 hover:text-primary-600 p-1">
          <i className="fas fa-eye"></i>
        </button>
        <button className="text-secondary-600 hover:text-accent-600 p-1">
          <i className="fas fa-download"></i>
        </button>
      </div>
    </div>
  );
};
export default DocumentsCard;
