import type { TeacherDocument } from "@/models/teacher-document";

const getDocumentIcon = (ext: string) => {
  const e = ext.toLowerCase();

  if (e === "pdf") {
    return {
      iconClass: "fas fa-file-pdf",
      bg: "bg-error-100 text-error-600",
    };
  }
  if (e === "doc" || e === "docx") {
    return {
      iconClass: "fas fa-file-word",
      bg: "bg-primary-100 text-primary-600",
    };
  }
  if (e === "ppt" || e === "pptx") {
    return {
      iconClass: "fas fa-file-powerpoint",
      bg: "bg-warning-100 text-warning-600",
    };
  }
  if (e === "xls" || e === "xlsx") {
    return {
      iconClass: "fas fa-file-excel",
      bg: "bg-success-100 text-success-600",
    };
  }
  if (e === "jpg" || e === "jpeg" || e === "png") {
    return {
      iconClass: "fas fa-file-image",
      bg: "bg-accent-100 text-accent-600",
    };
  }
  if (e === "zip" || e === "rar") {
    return {
      iconClass: "fas fa-file-archive",
      bg: "bg-primary-100 text-primary-600",
    };
  }

  return {
    iconClass: "fas fa-file-alt",
    bg: "bg-secondary-100 text-secondary-600",
  };
};

const getStatus = (expiry: string) => {
  const today = new Date();
  const exp = new Date(expiry);

  if (isNaN(exp.getTime())) {
    return {
      label: "No Expiry",
      className: "bg-secondary-100 text-secondary-700",
    };
  }

  if (exp < today) {
    return { label: "Expired", className: "bg-error-100 text-error-700" };
  }

  const diffDays = Math.ceil(
    (exp.getTime() - today.getTime()) / (1000 * 86400),
  );

  if (diffDays <= 30) {
    return {
      label: "Expires Soon",
      className: "bg-warning-100 text-warning-700",
    };
  }

  return { label: "Valid", className: "bg-success-100 text-success-700" };
};

const FileCard = ({ doc }: { doc: TeacherDocument }) => {
  const { iconClass, bg } = getDocumentIcon(doc.extension);
  const status = getStatus(doc.expiryDate);

  return (
    <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <i className={`${bg} rounded-lg p-2 ${iconClass}`}></i>

        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <button className="text-secondary-400 hover:text-secondary-600 p-1">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      <h4 className="text-secondary-900 mb-1 truncate font-medium">
        {doc.documentTitle}
      </h4>

      <p className="text-secondary-500 mb-2 text-xs">
        {doc.extension.toUpperCase()} • {doc.fileSizeInMB} MB
      </p>

      <div className="text-secondary-500 flex items-center justify-between text-xs">
        <span>{doc.issueDate}</span>
        <div className="flex items-center space-x-1">
          <i className="fas fa-calendar"></i>
          <span>{doc.expiryDate}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center space-x-1">
        <span className={`${status.className} rounded-full px-2 py-1 text-xs`}>
          {status.label}
        </span>
      </div>
    </div>
  );
};

export default FileCard;
