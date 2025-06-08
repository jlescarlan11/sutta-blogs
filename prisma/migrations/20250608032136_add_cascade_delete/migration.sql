-- DropForeignKey
ALTER TABLE "UserCommentLike" DROP CONSTRAINT "UserCommentLike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "UserCommented" DROP CONSTRAINT "UserCommented_blogId_fkey";

-- DropForeignKey
ALTER TABLE "UserLiked" DROP CONSTRAINT "UserLiked_blogId_fkey";

-- DropForeignKey
ALTER TABLE "UserViewed" DROP CONSTRAINT "UserViewed_blogId_fkey";

-- AddForeignKey
ALTER TABLE "UserCommented" ADD CONSTRAINT "UserCommented_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommentLike" ADD CONSTRAINT "UserCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "UserCommented"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLiked" ADD CONSTRAINT "UserLiked_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserViewed" ADD CONSTRAINT "UserViewed_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
