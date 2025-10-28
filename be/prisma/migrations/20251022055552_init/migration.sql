-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "usn" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "details" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "roomNo" TEXT NOT NULL,
    "usersId" INTEGER NOT NULL,

    CONSTRAINT "details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_usn_key" ON "users"("usn");

-- CreateIndex
CREATE UNIQUE INDEX "details_id_key" ON "details"("id");

-- AddForeignKey
ALTER TABLE "details" ADD CONSTRAINT "details_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
