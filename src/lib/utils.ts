import { getCurrentDateTimeString, toDate } from "@saintrelion/time-functions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearsOfService(startDate: string) {
  const start = toDate(startDate);
  const now = toDate(getCurrentDateTimeString());

  if (start != null && now != null) {
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    const days = now.getDate() - start.getDate();

    if (days < 0) {
      months -= 1; // not completed a full month
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // total years in decimal
    const totalYears = (years + months / 12).toFixed(1);

    return `${totalYears} years (${years * 12 + months} months)`;
  }

  return "0 years";
}

export function resolveImageSource(photoBase64: string | undefined) {
  if (!photoBase64 || photoBase64.trim() === "") {
    return "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
  }

  // Already a valid base64 string
  if (photoBase64.startsWith("data:image")) {
    return photoBase64;
  }

  // If saved as a plain link (fallback)
  if (photoBase64.startsWith("http")) {
    return photoBase64;
  }

  // If backend stored ONLY raw base64 string → wrap it
  return `data:image/jpeg;base64,${photoBase64}`;
}

export function resizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const maxHeight = 512;
        const scale = maxHeight / img.height;

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.2));
        // 0.7 = compression level
      };
    };

    reader.readAsDataURL(file);
  });
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getExpiryState = (expiryDate: string) => {
  const today = toDate(getCurrentDateTimeString());
  const exp = toDate(expiryDate);

  if (today == null || exp == null || isNaN(exp.getTime())) return "valid";

  if (exp < today) return "expired";

  const diffDays = (exp.getTime() - today.getTime()) / (1000 * 86400);
  if (diffDays <= 30) return "expiring";

  return "valid";
};
