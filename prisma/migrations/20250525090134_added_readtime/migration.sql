-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "publish" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readTime" INTEGER NOT NULL DEFAULT 0;
