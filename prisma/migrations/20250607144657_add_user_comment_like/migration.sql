-- CreateTable
CREATE TABLE "UserCommentLike" (
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "UserCommentLike_pkey" PRIMARY KEY ("userId","commentId")
);

-- AddForeignKey
ALTER TABLE "UserCommentLike" ADD CONSTRAINT "UserCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommentLike" ADD CONSTRAINT "UserCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "UserCommented"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
