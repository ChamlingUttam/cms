import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { splitList, telHref } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { ContactInfo, IconName } from "@/types";

const subject = encodeURIComponent("Website Enquiry");

const linkClass = "hover:text-ink block text-[13px] break-words text-[#6b7b82]";

function Row({
  icon,
  label,
  children,
}: {
  icon: IconName;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-line flex items-start gap-[18px] border-t py-[22px]">
      <Icon name={icon} className="mt-0.5 shrink-0 text-[#d89d1d]" />
      <div className="min-w-0">
        <b className="block text-[13px]">{label}</b>
        <div className="mt-1 space-y-1">{children}</div>
      </div>
    </li>
  );
}

/**
 * The school's address, phone numbers and emails from the admin dashboard.
 * Empty fields are hidden; a field holding several values shows each one as
 * its own link.
 */
export function ContactDetails({ contact }: { contact: ContactInfo }) {
  const emails = splitList(contact.email);
  const phones = splitList(contact.phoneNo);

  return (
    <div>
      <SectionHeading
        eyebrow="Get in touch"
        title="We’re here to"
        accent="help."
        stacked={false}
      />
      <p className="mt-6 mb-10 max-w-[400px] md:mb-[45px]">
        Our admissions office is open {siteConfig.contact.hours}.
      </p>
      <ul>
        {contact.address && (
          <Row icon="pin" label="Visit us">
            <address className="block text-[13px] text-[#6b7b82] not-italic">
              {contact.address}
            </address>
          </Row>
        )}
        {phones.length > 0 && (
          <Row icon="phone" label="Call us">
            {phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${telHref(phone)}`}
                className={linkClass}
              >
                {phone}
              </a>
            ))}
          </Row>
        )}
        {emails.length > 0 && (
          <Row icon="mail" label="Email us">
            {emails.map((email) => (
              <div key={email}>
                {/* Opens Gmail's compose window with "To" and "Subject" filled in */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    email
                  )}&su=${subject}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {email}
                </a>
                {/* Fallback for Outlook, Apple Mail, etc. */}
                <a
                  href={`mailto:${email}?subject=${subject}`}
                  className="hover:text-ink inline-block text-[11px] text-[#6b7b82] underline"
                >
                  Default mail app
                </a>
              </div>
            ))}
          </Row>
        )}
      </ul>
    </div>
  );
}
