import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { navItems } from "@/data/navigation";
import { siteConfig, socialLinks } from "@/lib/site";
import CurrentYear from "./CurrentYear";

const linkClass = "my-3 block text-[13px] text-[#b6c5cb] hover:text-white";

export function Footer() {
  const { contact } = siteConfig;

  return (
    <footer className="bg-navy-darkest pt-16 pb-6 text-white md:pt-[75px]">
      <Container>
        <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-[1.7fr_.7fr_1fr_1fr] lg:gap-[60px] lg:pb-[60px]">
          <div>
            <Logo light />
            <p className="mt-[27px] max-w-[330px] text-[13px] leading-[1.8] text-[#91a6ae]">
              A joyful, ambitious school where every learner is known,
              challenged, and inspired.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-gold mb-6 text-[11px] font-semibold tracking-[2px] uppercase">
              Explore
            </h2>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          <address className="not-italic">
            <h2 className="text-gold mb-6 text-[11px] font-semibold tracking-[2px] uppercase">
              Get in touch
            </h2>
            <p className="text-[13px] leading-[1.8] text-[#91a6ae]">
              {contact.address.street}
              <br />
              {contact.address.locality}, {contact.address.postalCode}
            </p>
            <p className="mt-4 text-[13px] leading-[1.8] text-[#91a6ae]">
              <a
                href={`mailto:${contact.email}`}
                className="break-words hover:text-white"
              >
                {contact.email}
              </a>
              <br />
              <a href={`tel:${contact.phoneHref}`} className="hover:text-white">
                {contact.phone}
              </a>
            </p>
          </address>

          <div>
            <h2 className="text-gold mb-6 text-[11px] font-semibold tracking-[2px] uppercase">
              Stay connected
            </h2>
            <p className="text-[13px] leading-[1.8] text-[#91a6ae]">
              News, events, and stories from our community.
            </p>
            <ul className="mt-5 flex gap-2">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${siteConfig.name} on ${social.label}`}
                    className="hover:border-gold hover:text-gold grid size-8 place-items-center border border-[#496574] text-[11px]"
                  >
                    {social.short}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-[#31505e] pt-6 text-[11px] text-[#69848f] sm:flex-row sm:justify-between">
          <span>
            © <CurrentYear /> {siteConfig.name}
          </span>
          <span>Privacy · Accessibility</span>
        </div>
      </Container>
    </footer>
  );
}
