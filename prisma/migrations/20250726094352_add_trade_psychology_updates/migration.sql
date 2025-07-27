/*
  Warnings:

  - You are about to drop the column `confidenceLevel` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `confirmationIndicators` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `emotionsAfter` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `emotionsBefore` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `exitReason` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `mistakeChecklist` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `mistakes` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `setupName` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `stopLossPts` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `targetPts` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `entryPrice` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exitPrice` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketType` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pnlPercentage` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stopLoss` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "confidenceLevel",
DROP COLUMN "confirmationIndicators",
DROP COLUMN "emotionsAfter",
DROP COLUMN "emotionsBefore",
DROP COLUMN "exitReason",
DROP COLUMN "mistakeChecklist",
DROP COLUMN "mistakes",
DROP COLUMN "notes",
DROP COLUMN "setupName",
DROP COLUMN "stopLossPts",
DROP COLUMN "targetPts",
ADD COLUMN     "entryPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "exitPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "marketType" TEXT NOT NULL,
ADD COLUMN     "outcomeSummary" TEXT,
ADD COLUMN     "pnlPercentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stopLoss" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "target" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "time" TEXT,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tradeAnalysis" TEXT;

-- CreateTable
CREATE TABLE "Psychology" (
    "id" SERIAL NOT NULL,
    "tradeId" INTEGER NOT NULL,
    "confidenceLevel" INTEGER NOT NULL,
    "emotionsBefore" TEXT,
    "emotionsAfter" TEXT,
    "notes" TEXT,
    "mistakes" TEXT,
    "mistakeChecklist" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whatIDidWell" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "screenshotUrl" TEXT,

    CONSTRAINT "Psychology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Psychology_tradeId_key" ON "Psychology"("tradeId");

-- AddForeignKey
ALTER TABLE "Psychology" ADD CONSTRAINT "Psychology_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
