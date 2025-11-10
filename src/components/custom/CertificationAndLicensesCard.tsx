const CertificationAndLicensesCard = ({
  name,
  expiryDuration,
  kvp,
}: {
  name: string;
  expiryDuration: number;
  kvp: Record<string, string>;
}) => {
  return (
    <div
      className={`${expiryDuration != -1 ? "border-warning-200 bg-warning-50" : "border border-slate-200"} rounded-lg border p-4`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center space-x-3">
            <h5 className="text-secondary-900 font-semibold">{name}</h5>
            {expiryDuration != -1 && (
              <span className="bg-warning-100 text-warning-700 rounded-full px-2 py-1 text-xs font-medium">
                Expiring Soon
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            {Object.entries(kvp).map(([key, value]) => (
              <>
                <div>
                  <p className="text-secondary-600">{key}</p>
                  <p className="font-medium">{value}</p>
                </div>
              </>
            ))}
          </div>
          {expiryDuration != -1 && (
            <div className="bg-warning-100 text-warning-800 mt-3 rounded p-2 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Renewal required within 4 months
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-secondary-600 hover:text-primary-600 p-2 transition-colors">
            <i className="fas fa-edit"></i>
          </button>
          <button className="text-secondary-600 hover:text-error-600 p-2 transition-colors">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default CertificationAndLicensesCard;
