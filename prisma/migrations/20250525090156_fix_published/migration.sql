/*
  Warnings:

  - You are about to drop the column `publish` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "publish",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
