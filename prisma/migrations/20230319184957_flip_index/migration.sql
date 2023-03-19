-- CreateTable
CREATE TABLE "Registration" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" STRING NOT NULL,
    "subscription" STRING NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rate_fetchedAt_idx" ON "Rate"("fetchedAt" DESC);
