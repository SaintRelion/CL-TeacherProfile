import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PDSSectionConfig } from "@/pds-schema";

/**
 * COMPACT EDITABLE FIELD
 * Reduced height from h-12 to h-10, smaller badge labels.
 */
const EditableField = ({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) => {
  const { register } = useFormContext();
  const isWide =
    /address|street|school|organization|title|subject|recognition|position|agency/i.test(
      name,
    );
  const spanClass = isWide ? "md:col-span-2" : "col-span-1";

  return (
    <div className={`${spanClass} group flex flex-col`}>
      <div className="mb-1 flex items-center px-1">
        <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-black tracking-[0.1em] text-slate-500 uppercase transition-all group-focus-within:bg-slate-900 group-focus-within:text-white">
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
      </div>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border-2 border-slate-100 bg-slate-50/40 px-3 text-sm font-semibold text-slate-900 shadow-sm transition-all outline-none hover:border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
      />
    </div>
  );
};

/**
 * COMPACT SELECT FIELD
 */
const SelectField = ({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="group w-full space-y-1">
          <div className="flex items-center px-1">
            <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-black tracking-[0.1em] text-slate-500 uppercase transition-all group-focus-within:bg-slate-900 group-focus-within:text-white">
              {label}
            </span>
          </div>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="h-10 w-full rounded-lg border-2 border-slate-100 bg-slate-50/40 text-sm font-semibold text-slate-900 transition-all focus:ring-2 focus:ring-slate-900/5">
              <SelectValue
                placeholder={
                  <span className="font-medium text-slate-400">Select...</span>
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {options.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-sm font-semibold"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );
};

const RadioGroup = ({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="group flex flex-col space-y-1.5">
          {/* Label Badge: Same compact style as EditableField */}
          <div className="flex items-center px-1">
            <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-black tracking-[0.1em] text-slate-500 uppercase transition-all group-focus-within:border-slate-900 group-focus-within:bg-slate-900 group-focus-within:text-white">
              {label}
            </span>
          </div>

          {/* Options Container: Aligned with min-h-10 to match input height */}
          <div className="flex min-h-[40px] flex-wrap items-center gap-x-6 gap-y-2 px-1">
            {options.map((option) => {
              const isSelected = field.value === option;
              return (
                <label
                  key={option}
                  className="group/item flex cursor-pointer items-center gap-2 select-none"
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => field.onChange(option)}
                  />

                  {/* Custom Radio Circle: Fixed size, perfectly centered */}
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 shadow-sm"
                        : "border-slate-200 bg-white group-hover/item:border-slate-400 group-hover/item:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`h-1 w-1 rounded-full bg-white transition-transform duration-200 ${isSelected ? "scale-100" : "scale-0"}`}
                    />
                  </div>

                  {/* Option Text: Matches input font weight/size */}
                  <span
                    className={`text-sm leading-none font-semibold transition-colors ${isSelected ? "text-slate-900" : "text-slate-500 group-hover/item:text-slate-700"}`}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    />
  );
};

const YesNoQuestionCard = ({
  name,
  title,
  detailLabel,
}: {
  name: string;
  title: string;
  detailLabel?: string;
}) => {
  const { control } = useFormContext();
  return (
    <div className="group overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all hover:border-slate-200">
      <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
        {/* Left: The Question - Reduced padding and font weight */}
        <div className="flex items-center bg-slate-50/30 px-5 py-4">
          <p className="text-[13px] leading-snug font-medium text-slate-600">
            {title}
          </p>
        </div>

        {/* Right: The Controls - Tightened spacing */}
        <div className="space-y-4 border-l border-slate-100 bg-white p-4">
          <Controller
            name={`${name}.answer`}
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {["Yes", "No"].map((opt) => {
                  const isActive = field.value === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => field.onChange(opt)}
                      className={`flex-1 rounded-xl border-2 py-2 text-[10px] font-black tracking-widest transition-all ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow-md"
                          : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      {opt.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            )}
          />

          {/* Detail field is now tighter */}
          <div className="mt-2">
            <EditableField
              label={detailLabel || "Give Details"}
              name={`${name}.details`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RenderSection = ({
  config,
  path = "",
}: {
  config: PDSSectionConfig;
  path?: string;
}) => {
  const { control } = useFormContext();
  const currentPath = path ? `${path}.${config.id}` : config.id;
  const isSubSection = path.length > 0;

  const {
    fields: listFields,
    append,
    remove,
  } = useFieldArray({ control, name: currentPath });
  const isCompactList = config.fields && config.fields.length <= 2;

  return (
    <div className="space-y-5">
      {" "}
      {/* Reduced from space-y-10 */}
      {/* Visual Break / Sub-Header */}
      {isSubSection && config.title && (
        <div className="relative flex items-center py-1">
          <div className="z-10 flex items-center gap-2 bg-white pr-4">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase">
              {config.title}
            </h4>
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
        </div>
      )}
      <div
        className={` ${isSubSection ? "border-l border-slate-100 pl-4" : ""} ${config.layout === "flex" ? "flex flex-wrap gap-4" : "space-y-5"} `}
      >
        {/* Static Grid - Tightened Gap */}
        {config.renderType === "static" && config.fields && (
          <div className="grid w-full grid-flow-row-dense grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
            {config.fields.map((f) => {
              const fieldName = `${currentPath}.${f.name}`;
              if (f.type === "question")
                return (
                  <div key={f.name} className="col-span-full">
                    <YesNoQuestionCard
                      name={fieldName}
                      title={f.description || f.label}
                      detailLabel={f.detailLabel}
                    />
                  </div>
                );
              if (f.type === "radio")
                return (
                  <RadioGroup
                    key={f.name}
                    label={f.label}
                    name={fieldName}
                    options={f.options || []}
                  />
                );
              if (f.type === "select")
                return (
                  <SelectField
                    key={f.name}
                    label={f.label}
                    name={fieldName}
                    options={f.options || []}
                  />
                );
              return (
                <EditableField
                  key={f.name}
                  label={f.label}
                  name={fieldName}
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                />
              );
            })}
          </div>
        )}

        {/* List Grid - Minimal Card Padding */}
        {config.renderType === "list" && (
          <div className="w-full space-y-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => append({})}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white transition-all active:scale-95"
              >
                + ADD ENTRY
              </button>
            </div>
            <div
              className={`grid gap-3 ${isCompactList ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" : "grid-cols-1"}`}
            >
              {listFields.map((field, index) => (
                <div
                  key={field.id}
                  className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-400"
                >
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute -top-2 -right-2 z-20 h-6 w-6 rounded-full border border-slate-200 bg-white text-slate-300 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-rose-500 hover:text-white"
                  >
                    <i className="fas fa-times text-[10px]" />
                  </button>
                  <div
                    className={`grid gap-3 ${isCompactList ? "grid-cols-1" : "md:grid-cols-2 xl:grid-cols-3"}`}
                  >
                    {config.fields?.map((f) => (
                      <EditableField
                        key={f.name}
                        label={f.label}
                        name={`${currentPath}.${index}.${f.name}`}
                        type={f.type}
                        placeholder={f.placeholder}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recursion */}
        {config.subSections?.map((sub) => (
          <div
            key={sub.id}
            className={
              config.layout === "flex" ? "min-w-[280px] flex-1" : "w-full"
            }
          >
            <RenderSection config={sub} path={currentPath} />
          </div>
        ))}
      </div>
    </div>
  );
};
