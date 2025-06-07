/*
  Warnings:

  - The primary key for the `BlogEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blogId` on the `BlogEntry` table. All the data in the column will be lost.
  - The primary key for the `UserCommented` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentId` on the `UserCommented` table. All the data in the column will be lost.
  - The required column `id` was added to the `BlogEntry` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `UserCommented` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "UserCommented" DROP CONSTRAINT "UserCommented_blogId_fkey";

-- DropForeignKey
ALTER TABLE "UserLiked" DROP CONSTRAINT "UserLiked_blogId_fkey";

-- DropForeignKey
ALTER TABLE "UserViewed" DROP CONSTRAINT "UserViewed_blogId_fkey";

-- AlterTable
ALTER TABLE "BlogEntry" DROP CONSTRAINT "BlogEntry_pkey",
DROP COLUMN "blogId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "BlogEntry_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserCommented" DROP CONSTRAINT "UserCommented_pkey",
DROP COLUMN "commentId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "UserCommented_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "UserCommented" ADD CONSTRAINT "UserCommented_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLiked" ADD CONSTRAINT "UserLiked_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserViewed" ADD CONSTRAINT "UserViewed_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
