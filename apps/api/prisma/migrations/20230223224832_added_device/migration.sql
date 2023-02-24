-- CreateTable
CREATE TABLE "Device" (
    "userId" INTEGER NOT NULL,
    "pushToken" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("userId","pushToken")
);

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
