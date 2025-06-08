/*
  Warnings:

  - You are about to drop the `UserFollowed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFollowed" DROP CONSTRAINT "UserFollowed_followeeId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowed" DROP CONSTRAINT "UserFollowed_followerId_fkey";

-- AlterTable
ALTER TABLE "BlogEntry" ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "UserFollowed";
