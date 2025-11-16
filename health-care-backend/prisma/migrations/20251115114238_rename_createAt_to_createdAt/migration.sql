-- Rename createAt to createdAt in appointments table
ALTER TABLE "appointments"
    RENAME COLUMN "createAt" TO "createdAt";
-- Rename createAt to createdAt in payments table
ALTER TABLE "payments"
    RENAME COLUMN "createAt" TO "createdAt";
-- Rename createAt to createdAt in prescriptions table
ALTER TABLE "prescriptions"
    RENAME COLUMN "createAt" TO "createdAt";