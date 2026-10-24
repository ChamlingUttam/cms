export const SITE_URL = "https://school.com";
export const SITE_NAME = "Our School";

export const FACEBOOK_URL = "https://facebook.com";
export const INSTAGRAM_URL = "https://instagram.com";
export const GMAIL = "example.com";

export const PHONE_DISPLAY = "+977 980000000"; // must include the country code
export const PHONE_TEL = PHONE_DISPLAY.replace(/[^\d+]/g, "");
// Ready-to-use links
export const TEL_URL = `tel:${PHONE_TEL}`;

export const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  GMAIL
)}&su=${encodeURIComponent("Appointment enquiry")}`;

export const LOCATION = "";
