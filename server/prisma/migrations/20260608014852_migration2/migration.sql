-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "githubURL" TEXT,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "linkedinURL" TEXT,
ADD COLUMN     "portfolioURL" TEXT,
ADD COLUMN     "role" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedToId" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
