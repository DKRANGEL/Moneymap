/*
  Warnings:

  - You are about to drop the column `dateTime` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `isDuplicate` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `isRecurring` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `mergeStatus` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `mergedWith` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `pluggyId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `uploadId` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CardBrand" AS ENUM ('visa', 'mastercard', 'elo', 'hipercard', 'amex', 'other');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('pix', 'boleto', 'credito', 'debito', 'dinheiro', 'transferencia');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pendente', 'pago', 'agendado');

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_uploadId_fkey";

-- DropIndex
DROP INDEX "transactions_pluggyId_idx";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "dateTime",
DROP COLUMN "isDuplicate",
DROP COLUMN "isRecurring",
DROP COLUMN "mergeStatus",
DROP COLUMN "mergedWith",
DROP COLUMN "pluggyId",
DROP COLUMN "source",
DROP COLUMN "uploadId",
ADD COLUMN     "cardId" TEXT,
ADD COLUMN     "installmentNumber" INTEGER,
ADD COLUMN     "installmentsTotal" INTEGER,
ADD COLUMN     "isFixed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "recurringGroupId" TEXT,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'pendente';

-- DropEnum
DROP TYPE "MergeStatus";

-- DropEnum
DROP TYPE "TransactionSource";

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "lastFour" CHAR(4) NOT NULL,
    "brand" "CardBrand" NOT NULL,
    "closingDay" INTEGER NOT NULL,
    "dueDay" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cards_userId_idx" ON "cards"("userId");

-- CreateIndex
CREATE INDEX "cards_accountId_idx" ON "cards"("accountId");

-- CreateIndex
CREATE INDEX "transactions_recurringGroupId_idx" ON "transactions"("recurringGroupId");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
