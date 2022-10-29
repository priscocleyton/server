/*
  Warnings:

  - You are about to drop the column `paymentmethod` on the `PaymentMethod` table. All the data in the column will be lost.
  - Added the required column `description` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaymentMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL
);
INSERT INTO "new_PaymentMethod" ("id") SELECT "id" FROM "PaymentMethod";
DROP TABLE "PaymentMethod";
ALTER TABLE "new_PaymentMethod" RENAME TO "PaymentMethod";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
