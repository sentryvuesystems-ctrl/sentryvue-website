-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "placement" TEXT NOT NULL,
    "cameraCount" INTEGER NOT NULL,
    "indoorCount" INTEGER NOT NULL,
    "outdoorCount" INTEGER NOT NULL,
    "resolution" TEXT NOT NULL,
    "kitName" TEXT NOT NULL,
    "storageTb" INTEGER NOT NULL,
    "kitPence" INTEGER NOT NULL,
    "storagePence" INTEGER NOT NULL,
    "discountPence" INTEGER NOT NULL,
    "subtotalPence" INTEGER NOT NULL,
    "deliveryPence" INTEGER,
    "totalPence" INTEGER NOT NULL,
    "launchOffer" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "county" TEXT,
    "postcode" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

