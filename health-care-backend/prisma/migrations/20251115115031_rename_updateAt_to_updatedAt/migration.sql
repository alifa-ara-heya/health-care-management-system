-- Rename updateAt to updatedAt in appointments table
ALTER TABLE "appointments"
    RENAME COLUMN "updateAt" TO "updatedAt";
-- Rename updateAt to updatedAt in payments table
ALTER TABLE "payments"
    RENAME COLUMN "updateAt" TO "updatedAt";
-- Rename updateAt to updatedAt in prescriptions table
ALTER TABLE "prescriptions"
    RENAME COLUMN "updateAt" TO "updatedAt";