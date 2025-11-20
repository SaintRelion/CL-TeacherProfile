const ComplianceStatusCard = ({
  wrapperColor,
  iconClassName,
  iconWrapperClassName,
  title,
  description,
  value,
  valueClassName,
}: {
  wrapperColor: string;
  iconClassName: string;
  iconWrapperClassName: string;
  title: string;
  description: string;
  value: string;
  valueClassName: string;
}) => {
  return (
    <div
      className={`${wrapperColor} flex items-center justify-between rounded-lg p-4`}
    >
      <div className="flex items-center space-x-3">
        <div className={iconWrapperClassName}>
          <i className={iconClassName}></i>
        </div>
        <div>
          <p className="text-secondary-900 font-medium">{title}</p>
          <p className="text-secondary-600 text-sm">{description}</p>
        </div>
      </div>
      <span className={valueClassName}>{value}</span>
    </div>
  );
};
export default ComplianceStatusCard;
