CREATE TABLE "Contact" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "address" TEXT,
    "email" TEXT,
    "phoneNo" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Contact_singleton_id_check" CHECK ("id" = 'global')
);
