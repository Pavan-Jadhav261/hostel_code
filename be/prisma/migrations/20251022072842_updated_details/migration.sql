/*
  Warnings:

  - A unique constraint covering the columns `[usersId]` on the table `details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "details_usersId_key" ON "details"("usersId");
