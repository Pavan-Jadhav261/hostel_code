-- CreateTable
CREATE TABLE "inOutDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "OutTime" TIMESTAMP(3) NOT NULL,
    "InTime" TIMESTAMP(3),
    "isOut" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "inOutDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inOutDetails_id_key" ON "inOutDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "inOutDetails_userId_key" ON "inOutDetails"("userId");

-- AddForeignKey
ALTER TABLE "inOutDetails" ADD CONSTRAINT "inOutDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
