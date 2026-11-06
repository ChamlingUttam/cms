// // /** Formats an ISO date ("2026-10-14") as "14 October 2026". UTC keeps server and browser identical. */
// // export function formatDate(iso: string): string {
// //   return new Date(iso).toLocaleDateString("en-GB", {
// //     day: "numeric",
// //     month: "long",
// //     year: "numeric",
// //     timeZone: "UTC",
// //   });
// // }

// // /** "Amara Okafor" -> "AO" */
// // export function initials(name: string): string {
// //   return name
// //     .split(/\s+/)
// //     .map((part) => part[0])
// //     .slice(0, 2)
// //     .join("")
// //     .toUpperCase();
// // }

// /**
//  * Formats an ISO date ("2026-10-14") as "14 October 2026". UTC keeps server and
//  * browser identical. Returns "" for a missing or invalid date.
//  */
// export function formatDate(iso: string): string {
//   const date = new Date(iso);
//   if (!iso || Number.isNaN(date.getTime())) return "";

//   return date.toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//     timeZone: "UTC",
//   });
// }

// /** "Amara Okafor" -> "AO" */
// export function initials(name: string): string {
//   return name
//     .split(/\s+/)
//     .map((part) => part[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
// }

// /** "+977 1 555 0100" -> "+97715550100", for tel: links. */
// export function telHref(phone: string): string {
//   return phone.replace(/[^\d+]/g, "");
// }

/**
 * Formats an ISO date ("2026-10-14") as "14 October 2026". UTC keeps server and
 * browser identical. Returns "" for a missing or invalid date.
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (!iso || Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Amara Okafor" -> "AO" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** "+977 1 555 0100" -> "+97715550100", for tel: links. */
export function telHref(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * The admin stores several emails or phone numbers in one field
 * ("a@x.com, b@x.com" or "9841/9851"). Splits them into a clean list.
 */
export function splitList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,;/|\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}
