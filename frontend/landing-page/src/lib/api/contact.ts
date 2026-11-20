import { cacheLife, cacheTag } from "next/cache";
import { dummyContactInfo } from "@/data/contact";
import type { ContactInfo } from "@/types";
import { failedLife } from "./cache";
import { apiGet } from "./client";
import { logApiFailure } from "./log";
import { isApiConfigured, showDummyContent } from "./config";
import { endpoints } from "./endpoints";

interface ContactInfoResponse {
  success?: boolean;
  // The backend returns `data.contact`; `contactInfo` is accepted too.
  data?: {
    contact?: Partial<ContactInfo> | null;
    contactInfo?: Partial<ContactInfo> | null;
  };
}

const clean = (value?: string | null) => value?.trim() || null;

/**
 * The admin's contact record. Cached and refreshed in the background about
 * once a minute. A failed request is cached for only a few seconds, so a
 * backend that was down at first is picked up again almost immediately.
 */
async function fetchContactInfo(): Promise<ContactInfo | null> {
  "use cache";
  cacheTag("contact-info");

  if (!isApiConfigured) {
    cacheLife("minutes");
    return null;
  }

  try {
    const json = await apiGet<ContactInfoResponse>(endpoints.contactInfo);
    const info = json.data?.contact ?? json.data?.contactInfo;
    cacheLife("minutes");
    if (!info) return null;

    return {
      id: info.id ?? "",
      address: clean(info.address),
      email: clean(info.email),
      phoneNo: clean(info.phoneNo),
    };
  } catch (error) {
    cacheLife(failedLife);
    logApiFailure("contact", error);
    return null;
  }
}

/**
 * The school's contact details from the admin dashboard. Fields the admin
 * left empty stay `null` and the site hides them. With no record at all, the
 * dummy details are used outside production (see `showDummyContent`).
 */
export async function getContactInfo(): Promise<ContactInfo> {
  const info = await fetchContactInfo();
  if (info) return info;

  return showDummyContent
    ? dummyContactInfo
    : { id: "", address: null, email: null, phoneNo: null };
}
