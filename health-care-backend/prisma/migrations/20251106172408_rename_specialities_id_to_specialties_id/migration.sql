-- DropForeignKey
ALTER TABLE "public"."doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialitiesId_fkey";

-- Drop primary key constraint
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_pkey";

-- Rename column from specialitiesId to specialtiesId
ALTER TABLE "doctor_specialties" RENAME COLUMN "specialitiesId" TO "specialtiesId";

-- Recreate primary key constraint with new column name
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("specialtiesId", "doctorId");

-- Recreate foreign key constraint with new column name
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
