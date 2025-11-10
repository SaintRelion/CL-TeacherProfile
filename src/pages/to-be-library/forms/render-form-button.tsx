import { useFormContext } from "react-hook-form";
import type { RenderFormButtonProps } from "./render-form-button-model";
import { Button } from "@/components/ui/button";

export const RenderFormButton = ({
  buttonLabel,
  buttonClass = "",
}: RenderFormButtonProps) => {
  // We still get context for type safety, but no need to re-handle submit here
  useFormContext();

  return (
    <Button
      type="submit"
      variant="outline"
      className={`${buttonClass} cursor-pointer`}
    >
      {buttonLabel}
    </Button>
  );
};
