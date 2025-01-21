import { easeLinear, select } from "d3";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

// User
export const validateUsername = (value: string | null) => {
  let newErr = null;
  if (value) {
    const cleanedValue = value.replace(/\s+/g, "");
    if (cleanedValue.length < 5) {
      newErr = "Username should be at least 5 characters!";
    }
    if (cleanedValue.length > 30) {
      newErr = "Username should be less than 30 characters!";
    }
    if (!/^[a-zA-Z0-9]+$/.test(cleanedValue)) {
      newErr = "Username should only contain letters and numbers!";
    }
  } else {
    newErr = "Please provide a username!";
  }
  return newErr;
};
export const validateEmail = (value: string | null) => {
  let newErr = null;
  if (value) {
    const cleanedValue = value.replace(/\s+/g, "");
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanedValue)
    ) {
      newErr = "Invalid email format!";
    }
  } else {
    newErr = "Please provide an email!";
  }
  return newErr;
};
export const validatePassword = (value: string | null) => {
  let newErr = null;
  if (value) {
    const cleanedValue = value.replace(/\s+/g, "");
    if (cleanedValue.length < 8) {
      newErr = "Password should be at least 8 characters!";
    } else if (!/[a-zA-Z]/.test(cleanedValue)) {
      newErr = "Password should contain at least one letter!";
    } else if (!/[0-9]/.test(cleanedValue)) {
      newErr = "Password should contain at least one digit!";
    }
    // else if (!/[!@#$%^&*]/.test(cleanedValue)) {
    //   newErr = "Password should contain at least one special character!";
    // }
  } else {
    newErr = "Please provide a password!";
  }
  return newErr;
};

// Comparison
export function deepComparison<T>(
  obj1: T | T[] | null,
  obj2: T | T[] | null
): boolean {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 == null ||
    obj2 == null
  ) {
    return false;
  }
  if (obj1.constructor !== obj2.constructor) return false;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => deepComparison(item, obj2[index]));
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    const val1 =
      (obj1 as Record<string, unknown>)[key] === ""
        ? null
        : (obj1 as Record<string, unknown>)[key];
    const val2 =
      (obj2 as Record<string, unknown>)[key] === ""
        ? null
        : (obj2 as Record<string, unknown>)[key];
    if (!keys2.includes(key) || !deepComparison(val1, val2)) {
      return false;
    }
  }
  return true;
}
export function compareArrays(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

// Formatting
export function formatDuration(isoDuration: string) {
  const parsedDuration = dayjs.duration(isoDuration);
  const days = parsedDuration.days();
  const hours = parsedDuration.hours();
  const minutes = parsedDuration.minutes();
  const seconds = Math.round(parsedDuration.asSeconds() % 60);
  return days
    ? `${days}d ${hours}h ${minutes}m`
    : hours
      ? `${hours}h ${minutes}m ${seconds === 0 ? "" : `${seconds}s`}`
      : minutes
        ? `${minutes}m ${seconds === 0 ? "" : `${seconds}s`}`
        : `${seconds}s`;
}
export function formatDurationSeconds(seconds: number) {
  const parsedDuration = dayjs.duration(seconds, "seconds");
  const days = parsedDuration.days();
  const hours = parsedDuration.hours();
  const minutes = parsedDuration.minutes();
  const remainingSeconds = Math.round(parsedDuration.asSeconds() % 60);
  return days
    ? `${days}d ${hours}h ${minutes}m`
    : hours
      ? `${hours}h ${minutes}m ${remainingSeconds === 0 ? "" : `${remainingSeconds}s`}`
      : minutes
        ? `${minutes}m ${remainingSeconds === 0 ? "" : `${remainingSeconds}s`}`
        : `${remainingSeconds}s`;
}
export function formatCreatedAtDate(dateString: string) {
  return `${new Date(dateString).toLocaleDateString("en-CA")} ${new Date(
    dateString
  ).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })}`;
}
export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "K";
  }
  return value.toString();
}
export function formatPlusMinus(value: number, currencySymbol = "$") {
  if (value >= 0) {
    return `${currencySymbol}${value.toLocaleString(undefined, { maximumFractionDigits: 10 })}`;
  } else {
    return `-${currencySymbol}${(-value).toLocaleString(undefined, { maximumFractionDigits: 10 })}`;
  }
}

// Styles
export const rippleAnimation = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  theme: boolean,
  duration?: number
) => {
  const color = theme ? "gray" : "white";
  const opacity = theme ? 0.3 : 0.5;

  const button = select(e.currentTarget);
  const node = button.node();
  const diameter = Math.max(node?.clientWidth ?? 0, node?.clientHeight ?? 0);
  const bbox = node?.getBoundingClientRect();
  const radius = diameter / 2;
  const ripple = button
    .append("span")
    .style("position", "absolute")
    .style("border-radius", "50%")
    .style("background-color", color ?? "black")
    .style("width", `${diameter}px`)
    .style("height", `${diameter}px`)
    .style("left", `${e.clientX - (bbox?.left ?? 0) - radius}px`)
    .style("top", `${e.clientY - (bbox?.top ?? 0) - radius}px`)
    .style("opacity", opacity ?? 0.1)
    .style("transform", "scale(0)");
  ripple
    .transition()
    .duration(duration ?? 600)
    .ease(easeLinear)
    .style("opacity", "0")
    .style("transform", "scale(5)")
    .on("end", () => ripple.remove()); 
};
