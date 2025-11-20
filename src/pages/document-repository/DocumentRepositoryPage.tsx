import FileCard from "@/components/document-repository/FileCard";
import Filters from "@/components/document-repository/Filters";
import FolderCard from "@/components/document-repository/FolderCard";
import KpiCard from "@/components/document-repository/KpiCard";
import { useState } from "react";
import { toDate } from "@saintrelion/time-functions";

const DocumentRepositoryPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({
    category: "",
    sort: "",
    quickTag: "",
  });

  const mockKPI: Record<string, string>[] = [
    {
      title: "Total Documents",
      value: "2,847",
      iconClassName:
        "fas fa-file-alt text-primary-600 bg-primary-100 rounded-lg p-2",
    },
    {
      title: "Storage Used",
      value: "24.8 GB",
      iconClassName: "fas fa-hdd text-accent-600 bg-accent-100 rounded-lg p-2",
    },
    {
      title: "Recent Uploads",
      value: "156",
      iconClassName:
        "fas fa-upload text-success-600 bg-success-100 rounded-lg p-2",
    },
    {
      title: "Shared Files",
      value: "432",
      iconClassName:
        "fas fa-share-alt text-secondary-600 bg-secondary-100 rounded-lg p-2",
    },
  ];

  const mockFolder: Record<string, string>[] = [
    { title: "Teaching Licenses", value: "247" },
    { title: "CPD Certificates", value: "189" },
    { title: "Performance Reviews", value: "156" },
    { title: "Contracts", value: "98" },
    { title: "Training Records", value: "234" },
    { title: "Medical Records", value: "67" },
  ];

  const mockFiles: Record<string, string>[] = [
    {
      fileName: "Teaching License - Maria Santos",
      fileType: "PDF",
      fileSize: "2.4",
      createdAt: "Sep 18, 2025",
      views: "24",
      status: "Valid",
      statusClassName: "bg-success-100 text-success-700",
      iconClassName:
        "bg-error-100 text-error-600 rounded-lg p-2 fas fa-file-pdf",
    },
    {
      fileName: "Performance Review - Juan Dela Cruz",
      fileType: "DOCX",
      fileSize: "1.8",
      createdAt: "Sep 17, 2025",
      views: "12",
      status: "Reviewed",
      statusClassName: "bg-primary-100 text-primary-700",
      iconClassName:
        "bg-primary-100 text-primary-600 rounded-lg p-2 fas fa-file-word",
    },
    {
      fileName: "CPD Certificate - Ana Reyes",
      fileType: "JPG",
      fileSize: "3.2",
      createdAt: "Sep 16, 2025",
      views: " 8",
      status: "Expires Soon",
      statusClassName: "bg-warning-100 text-warning-700",
      iconClassName:
        "bg-accent-100 text-accent-600 rounded-lg p-2 fas fa-file-image",
    },
    {
      fileName: "Training Completion Report",
      fileType: "XLSX",
      fileSize: "0.892",
      createdAt: "Sep 15, 2025",
      views: "31",
      status: "Complete",
      statusClassName: "bg-success-100 text-success-700",
      iconClassName:
        "bg-success-100 text-success-600 rounded-lg p-2 fas fa-file-excel",
    },
    {
      fileName: "Employment Contract - Carlos Mendoza",
      fileType: "PDF",
      fileSize: "1.5",
      createdAt: "Sep 14, 2025",
      views: " 6",
      status: "Active",
      statusClassName: "bg-primary-100 text-primary-700",
      iconClassName:
        "bg-secondary-100 text-secondary-600 rounded-lg p-2 fas fa-file-alt",
    },
    {
      fileName: "Workshop Presentation - Elena Rodriguez",
      fileType: "PPTX",
      fileSize: "4.7",
      createdAt: "Sep 13, 2025",
      views: "18",
      status: "Shared",
      statusClassName: "bg-accent-100 text-accent-700",
      iconClassName:
        "bg-warning-100 text-warning-600 rounded-lg p-2 fas fa-file-powerpoint",
    },
    {
      fileName: "Medical Certificate - Rosa Martinez",
      fileType: "PDF",
      fileSize: "1.1",
      createdAt: "Sep 12, 2025",
      views: " 4",
      status: "Current",
      statusClassName: "bg-success-100 text-success-700",
      iconClassName:
        "bg-error-100 text-error-600 rounded-lg p-2 fas fa-file-pdf",
    },
    {
      fileName: "Academic Records Archive",
      fileType: "ZIP",
      fileSize: "12.3",
      createdAt: "Sep 11, 2025",
      views: "15",
      status: "Archive",
      statusClassName: "bg-secondary-100 text-secondary-700",
      iconClassName:
        "bg-primary-100 text-primary-600 rounded-lg p-2 fas fa-file-archive",
    },
  ];

  const filteredFiles = mockFiles.filter((file) => {
    const searchTerm = search.toLowerCase();

    // Search by fileName, fileType
    if (
      searchTerm &&
      !(
        file.fileName.toLowerCase().includes(searchTerm) ||
        file.fileType.toLowerCase().includes(searchTerm)
      )
    ) {
      return false;
    }

    // Category filter
    if (filters.category) {
      const categoryMap: Record<string, string[]> = {
        certifications: ["PDF", "JPG"],
        evaluations: ["DOCX"],
        training: ["XLSX", "PPTX"],
        contracts: ["PDF", "DOCX"],
        personal: ["PDF", "JPG", "DOCX"],
      };
      if (!categoryMap[filters.category]?.includes(file.fileType)) return false;
    }

    // Quick tag filters
    if (filters.quickTag) {
      switch (filters.quickTag) {
        case "none":
          // e.g., last 3 files
          if (
            new Date(file.createdAt) <
            new Date(
              Math.max(
                ...mockFiles.map((f) => new Date(f.createdAt).getTime()),
              ),
            )
          )
            return true;
          break;
        case "recent":
          // e.g., last 3 files
          if (
            new Date(file.createdAt) <
            new Date(
              Math.max(
                ...mockFiles.map((f) => new Date(f.createdAt).getTime()),
              ),
            )
          )
            return false;
          break;
        case "shared":
          if (!file.status.toLowerCase().includes("shared")) return false;
          break;
        case "favorites":
          if (!file.status.toLowerCase().includes("favorite")) return false;
          break;
        case "expiring":
          if (!file.status.toLowerCase().includes("expires")) return false;
          break;
        case "large":
          if (parseFloat(file.fileSize) < 2) return false;
          break;
      }
    }

    return true;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (filters.sort) {
      case "created": {
        const aDate = toDate(a.createdAt);
        const bDate = toDate(b.createdAt);

        if (aDate != null && bDate != null)
          return aDate.getTime() - bDate.getTime();
        else return -1;
      }
      case "modified": {
        const aDate = toDate(a.createdAt);
        const bDate = toDate(b.createdAt);

        if (aDate != null && bDate != null)
          return aDate.getTime() - bDate.getTime();
        else return -1;
      }
      case "name":
        return a.fileName.localeCompare(b.fileName);
      case "size":
        return parseFloat(a.fileSize) - parseFloat(b.fileSize);
      default:
        return 0;
    }
  });

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-secondary-900 mb-2 text-3xl font-bold">
              Document Repository
            </h2>
            <p className="text-secondary-600">
              Centralized file management with advanced organization and search
              capabilities
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-3 md:mt-0">
            <button className="bg-accent-500 hover:bg-accent-600 flex items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white transition-colors">
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Bulk Upload</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 flex items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white transition-colors">
              <i className="fas fa-plus"></i>
              <span>New Folder</span>
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {mockKPI.map((value, index) => (
            <KpiCard key={index} kvp={value} />
          ))}
        </div>
      </div>

      <Filters
        filters={filters}
        onSearchChange={(value) => setSearch(value)}
        onFilterChange={(filterType, value) => {
          if (filterType === "reset") {
            setFilters({
              category: "",
              sort: "",
              quickTag: "",
            });
            return;
          }

          setFilters((prev) => ({ ...prev, [filterType]: value }));
        }}
      />

      <div className="text-secondary-600 mb-6 flex items-center space-x-2 text-sm">
        <i className="fas fa-home"></i>
        <span>Repository</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h3 className="text-secondary-900 mb-4 text-lg font-semibold">
            Folders
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {mockFolder.map((value, index) => (
              <FolderCard key={index} kvp={value} />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-secondary-900 text-lg font-semibold">
              Recent Documents
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedFiles.map((value, index) => (
              <FileCard key={index} kvp={value} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
export default DocumentRepositoryPage;
