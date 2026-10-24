import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {
  FACEBOOK_URL,
  GMAIL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  SITE_NAME,
  SITE_URL,
  TEL_URL,
} from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/facilities", label: "Contact" },
  { href: "/programs", label: "Programs" },
  { href: "/contact", label: "Contact" },
] as const;

// legal_links

const SOCIALS = [
  {
    href: FACEBOOK_URL,
    label: "Visit our Facebook page",
    Icon: FaFacebook,
  },
  {
    href: INSTAGRAM_URL,
    label: "Visit our Instagram page",
    Icon: FaInstagram,
  },
] as const;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500";

const Footer: React.FC = () => {
  return (
    <footer
      itemScope
      itemType="https://schema.org/School"
      className="bg-slate-900 px-[max(env(safe-area-inset-left),env(safe-area-inset-right))] text-slate-300"
    >
      {/* Structured data (not visible, read by search engines) */}
      <meta itemProp="name" content={SITE_NAME} />
      <meta itemProp="url" content={SITE_URL} />
      <meta itemProp="image" content={`${SITE_URL}/logo-spine.png`} />
      <meta itemProp="priceRange" content="$$" />
      {SOCIALS.map(({ href }) => (
        <link key={href} itemProp="sameAs" href={href} />
      ))}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:px-10 md:grid-cols-12 md:gap-8 lg:px-6">
        {/* About / Social */}
        <div className="md:col-span-5 lg:col-span-4">
          <Link href="/" className="inline-block">
            <Image
              src="/logo-spine.png"
              alt="School logo"
              width={300}
              height={100}
              loading="eager"
              className="h-auto w-36 brightness-0 invert sm:w-40"
            />
          </Link>

          <p className="mt-4 md:max-w-sm text-base leading-relaxed text-slate-400">
            SCHOOL MOTTO
          </p>
        </div>

        {/*  Quick links */}

        <div className="md:col-span-3 lg:col-span-3">
          <h3 className="text-base font-semibold text-white">Company</h3>
          <nav aria-label="Footer navigation" className="mt-4">
            <ul className="space-y-3 text-base">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-slate-400 transition-colors hover:text-white ${focusRing}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact Information */}
        <div className="md:col-span-4 lg:col-span-5">
          <h3 className="text-base font-semibold text-white">Get in touch</h3>

          <address
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
            style={{ fontStyle: "normal" }}
            className="mt-4 text-base text-slate-400"
          >
            <p itemProp="streetAddress">School address</p>
          </address>

          <a
            href={`mailto:${GMAIL}`}
            itemProp="email"
            className={`mt-2 inline-block break-all text-base text-slate-400 underline decoration-slate-600 underline-offset-2 transition-colors hover:text-white ${focusRing}`}
          >
            {GMAIL}
          </a>

          <dl className="mt-5 text-base">
            <div className="flex flex-wrap gap-2">
              <dt className="text-slate-500">Help Line:</dt>
              <dd>
                <a
                  href={TEL_URL}
                  itemProp="telephone"
                  className={`text-slate-300 underline decoration-slate-600 underline-offset-2 transition-colors hover:text-white ${focusRing}`}
                >
                  {PHONE_DISPLAY}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
