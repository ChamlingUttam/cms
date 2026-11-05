// import { Icon } from "@/components/ui/Icon";
// import { SectionHeading } from "@/components/ui/SectionHeading";
// import { siteConfig } from "@/lib/site";
// import type { IconName } from "@/types";

// interface Row {
//   icon: IconName;
//   label: string;
//   value: string;
//   href?: string;
// }

// export function ContactInfo() {
//   const { contact } = siteConfig;
//   const rows: Row[] = [
//     {
//       icon: "pin",
//       label: "Visit us",
//       value: `${contact.address.street}, ${contact.address.locality}, ${contact.address.postalCode}`,
//     },
//     {
//       icon: "phone",
//       label: "Call us",
//       value: contact.phone,
//       href: `tel:${contact.phoneHref}`,
//     },
//     {
//       icon: "mail",
//       label: "Email us",
//       value: contact.email,
//       href: `mailto:${contact.email}`,
//       // href: `mailto:${contact.email}?subject=Website Enquiry`,
//     },
//   ];

//   return (
//     <div>
//       <SectionHeading
//         eyebrow="Get in touch"
//         title="We’re here to"
//         accent="help."
//         stacked={false}
//       />
//       <p className="mt-6 mb-10 max-w-[400px] md:mb-[45px]">
//         Our admissions office is open {contact.hours}.
//       </p>
//       <ul>
//         {rows.map((row) => (
//           <li
//             key={row.label}
//             className="border-line flex items-start gap-[18px] border-t py-[22px]"
//           >
//             <Icon name={row.icon} className="mt-0.5 shrink-0 text-[#d89d1d]" />
//             <div className="min-w-0">
//               <b className="block text-[13px]">{row.label}</b>
//               {row.href ? (
//                 <a
//                   href={row.href}
//                   className="hover:text-ink mt-1 block text-[13px] break-words text-[#6b7b82]"
//                 >
//                   {row.value}
//                 </a>
//               ) : (
//                 <address className="mt-1 block text-[13px] text-[#6b7b82] not-italic">
//                   {row.value}
//                 </address>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";
import type { IconName } from "@/types";

interface Row {
  icon: IconName;
  label: string;
  value: string;
  href?: string;
  external?: boolean; // open in a new tab
  altHref?: string; // optional second link
}

export function ContactInfo() {
  const { contact } = siteConfig;

  const rows: Row[] = [
    {
      icon: "pin",
      label: "Visit us",
      value: `${contact.address.street}, ${contact.address.locality}, ${contact.address.postalCode}`,
    },
    {
      icon: "phone",
      label: "Call us",
      value: contact.phone,
      href: `tel:${contact.phoneHref}`,
    },
    {
      icon: "mail",
      label: "Email us",
      value: contact.email,
      // Opens Gmail's compose window with the "To" and "Subject" filled in
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`,
      external: true,
      // Fallback for visitors who use Outlook, Apple Mail, etc.
      altHref: `mailto:${contact.email}`,
    },
  ];

  return (
    <div>
      <SectionHeading
        eyebrow="Get in touch"
        title="We’re here to"
        accent="help."
        stacked={false}
      />
      <p className="mt-6 mb-10 max-w-[400px] md:mb-[45px]">
        Our admissions office is open {contact.hours}.
      </p>
      <ul>
        {rows.map((row) => (
          <li
            key={row.label}
            className="border-line flex items-start gap-[18px] border-t py-[22px]"
          >
            <Icon name={row.icon} className="mt-0.5 shrink-0 text-[#d89d1d]" />
            <div className="min-w-0">
              <b className="block text-[13px]">{row.label}</b>
              {row.href ? (
                <a
                  href={row.href}
                  {...(row.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="hover:text-ink mt-1 block text-[13px] break-words text-[#6b7b82]"
                >
                  {row.value}
                </a>
              ) : (
                <address className="mt-1 block text-[13px] text-[#6b7b82] not-italic">
                  {row.value}
                </address>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
