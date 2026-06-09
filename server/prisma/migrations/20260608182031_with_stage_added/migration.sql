/*
  Warnings:

  - Added the required column `teamId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT,
ADD COLUMN     "teamId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'todo';

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "teamLogo" TEXT;

-- CreateTable
CREATE TABLE "Stage" (
    "id" SERIAL NOT NULL,
    "stageName" TEXT NOT NULL,
    "deadline" TEXT NOT NULL DEFAULT 'Not Declared',
    "hackathonId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
