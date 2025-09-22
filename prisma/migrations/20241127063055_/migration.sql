/*
  Warnings:

  - Added the required column `Staff` to the `StaffUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StaffUser" ADD COLUMN     "Staff" BOOLEAN NOT NULL;
