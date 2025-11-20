const DocumentRepositoryPage = () => {
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
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">
                  Total Documents
                </p>
                <p className="text-secondary-900 mt-1 text-2xl font-bold">
                  2,847
                </p>
              </div>
              <div className="bg-primary-100 rounded-lg p-2">
                <i className="fas fa-file-alt text-primary-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">
                  Storage Used
                </p>
                <p className="text-secondary-900 mt-1 text-2xl font-bold">
                  24.8 GB
                </p>
              </div>
              <div className="bg-accent-100 rounded-lg p-2">
                <i className="fas fa-hdd text-accent-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">
                  Recent Uploads
                </p>
                <p className="text-secondary-900 mt-1 text-2xl font-bold">
                  156
                </p>
              </div>
              <div className="bg-success-100 rounded-lg p-2">
                <i className="fas fa-upload text-success-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">
                  Shared Files
                </p>
                <p className="text-secondary-900 mt-1 text-2xl font-bold">
                  432
                </p>
              </div>
              <div className="bg-secondary-100 rounded-lg p-2">
                <i className="fas fa-share-alt text-secondary-600"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents, content, or metadata..."
                className="focus:ring-primary-500 w-full rounded-lg border border-slate-300 py-3 pr-12 pl-10 focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <i className="fas fa-search text-secondary-400 absolute top-1/2 left-3 -translate-y-1/2 transform"></i>
              <button className="text-secondary-400 hover:text-primary-600 absolute top-1/2 right-3 -translate-y-1/2 transform">
                <i className="fas fa-sliders-h"></i>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select className="focus:ring-primary-500 rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none">
              <option>All Categories</option>
              <option>Certifications</option>
              <option>Evaluations</option>
              <option>Training Records</option>
              <option>Contracts</option>
              <option>Personal Documents</option>
            </select>

            <select className="focus:ring-primary-500 rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none">
              <option>Date Modified</option>
              <option>Date Created</option>
              <option>File Name</option>
              <option>File Size</option>
            </select>

            <div className="flex items-center rounded-lg bg-slate-100 p-1">
              <button className="text-primary-600 rounded-md bg-white p-2 shadow-sm">
                <i className="fas fa-th-large"></i>
              </button>
              <button className="text-secondary-400 hover:text-primary-600 p-2">
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-full px-3 py-1 text-sm font-medium transition-colors">
            Recent
          </button>
          <button className="text-secondary-600 rounded-full bg-slate-100 px-3 py-1 text-sm transition-colors hover:bg-slate-200">
            Shared with me
          </button>
          <button className="text-secondary-600 rounded-full bg-slate-100 px-3 py-1 text-sm transition-colors hover:bg-slate-200">
            Favorites
          </button>
          <button className="text-secondary-600 rounded-full bg-slate-100 px-3 py-1 text-sm transition-colors hover:bg-slate-200">
            Expiring soon
          </button>
          <button className="text-secondary-600 rounded-full bg-slate-100 px-3 py-1 text-sm transition-colors hover:bg-slate-200">
            Large files
          </button>
        </div>
      </div>

      <div className="text-secondary-600 mb-6 flex items-center space-x-2 text-sm">
        <i className="fas fa-home"></i>
        <span>Repository</span>
        <i className="fas fa-chevron-right text-xs"></i>
        <span>Teacher Documents</span>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-secondary-900 font-medium">Certifications</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h3 className="text-secondary-900 mb-4 text-lg font-semibold">
            Folders
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <div className="group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-slate-50">
              <div className="bg-primary-100 group-hover:bg-primary-200 mb-2 rounded-lg p-3 transition-colors">
                <i className="fas fa-folder text-primary-600 text-2xl"></i>
              </div>
              <span className="text-secondary-900 text-center text-sm font-medium">
                Teaching Licenses
              </span>
              <span className="text-secondary-500 text-xs">247 files</span>
            </div>

            <div className="group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-slate-50">
              <div className="bg-accent-100 group-hover:bg-accent-200 mb-2 rounded-lg p-3 transition-colors">
                <i className="fas fa-folder text-accent-600 text-2xl"></i>
              </div>
              <span className="text-secondary-900 text-center text-sm font-medium">
                CPD Certificates
              </span>
              <span className="text-secondary-500 text-xs">189 files</span>
            </div>

            <div className="group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-slate-50">
              <div className="bg-success-100 group-hover:bg-success-200 mb-2 rounded-lg p-3 transition-colors">
                <i className="fas fa-folder text-success-600 text-2xl"></i>
              </div>
              <span className="text-secondary-900 text-center text-sm font-medium">
                Performance Reviews
              </span>
              <span className="text-secondary-500 text-xs">156 files</span>
            </div>

            <div className="group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-slate-50">
              <div className="bg-warning-100 group-hover:bg-warning-200 mb-2 rounded-lg p-3 transition-colors">
                <i className="fas fa-folder text-warning-600 text-2xl"></i>
              </div>
              <span className="text-secondary-900 text-center text-sm font-medium">
                Contracts
              </span>
              <span className="text-secondary-500 text-xs">98 files</span>
            </div>

            <div className="group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-slate-50">
              <div className="bg-secondary-100 group-hover:bg-secondary-200 mb-2 rounded-lg p-3 transition-colors">
                <i className="fas fa-folder text-secondary-600 text-2xl"></i>
              </div>
              <span className="text-secondary-900 text-center text-sm font-medium">
                Training Records
              </span>
              <span className="text-secondary-500 text-xs">234 files</span>
            </div>

            <div className="group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-slate-50">
              <div className="bg-error-100 group-hover:bg-error-200 mb-2 rounded-lg p-3 transition-colors">
                <i className="fas fa-folder text-error-600 text-2xl"></i>
              </div>
              <span className="text-secondary-900 text-center text-sm font-medium">
                Medical Records
              </span>
              <span className="text-secondary-500 text-xs">67 files</span>
            </div>
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
            <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div className="bg-error-100 rounded-lg p-2">
                  <i className="fas fa-file-pdf text-error-600"></i>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-secondary-400 hover:text-secondary-600 p-1">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-secondary-900 mb-1 truncate font-medium">
                Teaching License - Maria Santos
              </h4>
              <p className="text-secondary-500 mb-2 text-xs">PDF • 2.4 MB</p>
              <div className="text-secondary-500 flex items-center justify-between text-xs">
                <span>Sep 18, 2025</span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>24</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <span className="bg-success-100 text-success-700 rounded-full px-2 py-1 text-xs">
                  Valid
                </span>
              </div>
            </div>

            <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div className="bg-primary-100 rounded-lg p-2">
                  <i className="fas fa-file-word text-primary-600"></i>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-secondary-400 hover:text-secondary-600 p-1">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-secondary-900 mb-1 truncate font-medium">
                Performance Review - Juan Dela Cruz
              </h4>
              <p className="text-secondary-500 mb-2 text-xs">DOCX • 1.8 MB</p>
              <div className="text-secondary-500 flex items-center justify-between text-xs">
                <span>Sep 17, 2025</span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>12</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <span className="bg-primary-100 text-primary-700 rounded-full px-2 py-1 text-xs">
                  Reviewed
                </span>
              </div>
            </div>

            <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div className="bg-accent-100 rounded-lg p-2">
                  <i className="fas fa-file-image text-accent-600"></i>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-secondary-400 hover:text-secondary-600 p-1">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-secondary-900 mb-1 truncate font-medium">
                CPD Certificate - Ana Reyes
              </h4>
              <p className="text-secondary-500 mb-2 text-xs">JPG • 3.2 MB</p>
              <div className="text-secondary-500 flex items-center justify-between text-xs">
                <span>Sep 16, 2025</span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>8</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <span className="bg-warning-100 text-warning-700 rounded-full px-2 py-1 text-xs">
                  Expires Soon
                </span>
              </div>
            </div>

            <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div className="bg-success-100 rounded-lg p-2">
                  <i className="fas fa-file-excel text-success-600"></i>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-secondary-400 hover:text-secondary-600 p-1">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-secondary-900 mb-1 truncate font-medium">
                Training Completion Report
              </h4>
              <p className="text-secondary-500 mb-2 text-xs">XLSX • 892 KB</p>
              <div className="text-secondary-500 flex items-center justify-between text-xs">
                <span>Sep 15, 2025</span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>31</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <span className="bg-success-100 text-success-700 rounded-full px-2 py-1 text-xs">
                  Complete
                </span>
              </div>
            </div>

            <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div className="bg-secondary-100 rounded-lg p-2">
                  <i className="fas fa-file-alt text-secondary-600"></i>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-secondary-400 hover:text-secondary-600 p-1">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-secondary-900 mb-1 truncate font-medium">
                Employment Contract - Carlos Mendoza
              </h4>
              <p className="text-secondary-500 mb-2 text-xs">PDF • 1.5 MB</p>
              <div className="text-secondary-500 flex items-center justify-between text-xs">
                <span>Sep 14, 2025</span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>6</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <span className="bg-primary-100 text-primary-700 rounded-full px-2 py-1 text-xs">
                  Active
                </span>
              </div>
            </div>

            <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div className="bg-warning-100 rounded-lg p-2">
                  <i className="fas fa-file-powerpoint text-warning-600"></i>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-secondary-400 hover:text-secondary-600 p-1">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-secondary-900 mb-1 truncate font-medium">
                Workshop Presentation - Elena Rodriguez
              </h4>
              <p className="text-secondary-500 mb-2 text-xs">PPTX • 4.7 MB</p>
              <div className="text-secondary-500 flex items-center justify-between text-xs">
                <span>Sep 13, 2025</span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>18</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <span className="bg-accent-100 text-accent-700 rounded-full px-2 py-1 text-xs">
                  Shared
                </span>
              </div>
            </div>

            <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div className="bg-error-100 rounded-lg p-2">
                  <i className="fas fa-file-pdf text-error-600"></i>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-secondary-400 hover:text-secondary-600 p-1">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-secondary-900 mb-1 truncate font-medium">
                Medical Certificate - Rosa Martinez
              </h4>
              <p className="text-secondary-500 mb-2 text-xs">PDF • 1.1 MB</p>
              <div className="text-secondary-500 flex items-center justify-between text-xs">
                <span>Sep 12, 2025</span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>4</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <span className="bg-success-100 text-success-700 rounded-full px-2 py-1 text-xs">
                  Current
                </span>
              </div>
            </div>

            <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <div className="bg-primary-100 rounded-lg p-2">
                  <i className="fas fa-file-archive text-primary-600"></i>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="text-secondary-400 hover:text-secondary-600 p-1">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-secondary-900 mb-1 truncate font-medium">
                Academic Records Archive
              </h4>
              <p className="text-secondary-500 mb-2 text-xs">ZIP • 12.3 MB</p>
              <div className="text-secondary-500 flex items-center justify-between text-xs">
                <span>Sep 11, 2025</span>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>15</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <span className="bg-secondary-100 text-secondary-700 rounded-full px-2 py-1 text-xs">
                  Archive
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default DocumentRepositoryPage;
