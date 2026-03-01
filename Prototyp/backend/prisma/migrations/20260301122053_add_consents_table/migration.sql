-- CreateTable
CREATE TABLE "consents" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "consent_type" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT false,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consents_user_id_consent_type_key" ON "consents"("user_id", "consent_type");

-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
