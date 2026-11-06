// // import { programs } from "@/data/programs";

// // export const interestOptions: string[] = [
// //   ...programs.map((program) => program.title),
// //   "Campus tour",
// // ];

// import { programs } from "@/data/programs";
// import { siteConfig } from "@/lib/site";
// import type { ContactInfo } from "@/types";

// export const interestOptions: string[] = [
//   ...programs.map((program) => program.title),
//   "Campus tour",
// ];

// const { address, email, phone } = siteConfig.contact;

// /**
//  * DUMMY CONTENT. Shown only in development (or when SHOW_DUMMY_CONTENT=true)
//  * while the admin dashboard has no contact details or the API is unreachable.
//  * Edit the values in `siteConfig.contact` (src/lib/site.ts).
//  */
// export const dummyContactInfo: ContactInfo = {
//   id: "dummy-contact",
//   address: `${address.street}, ${address.locality}, ${address.postalCode}`,
//   email,
//   phoneNo: phone,
// };

import { programs } from "@/data/programs";
import { siteConfig } from "@/lib/site";
import type { ContactInfo } from "@/types";

export const interestOptions: string[] = [
  ...programs.map((program) => program.title),
  "Campus tour",
];

const { address, email, phone } = siteConfig.contact;

/**
 * DUMMY CONTENT. Shown only in development (or when SHOW_DUMMY_CONTENT=true)
 * while the admin dashboard has no contact details or the API is unreachable.
 * Edit the values in `siteConfig.contact` (src/lib/site.ts).
 */
export const dummyContactInfo: ContactInfo = {
  id: "dummy-contact",
  address: `${address.street}, ${address.locality}, ${address.postalCode}`,
  email,
  phoneNo: phone,
};
