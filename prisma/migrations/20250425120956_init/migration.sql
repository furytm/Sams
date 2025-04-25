-- CreateTable
CREATE TABLE "ContactUS" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "workemail" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "catergory" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "findus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactUS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactUS_workemail_key" ON "ContactUS"("workemail");
