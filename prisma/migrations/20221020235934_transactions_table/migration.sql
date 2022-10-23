-- CreateTable
CREATE TABLE "TransactionsTable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "bills" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "history" TEXT NOT NULL
);
