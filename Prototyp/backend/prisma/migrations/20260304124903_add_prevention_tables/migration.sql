-- CreateTable
CREATE TABLE "prevention_schedules" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gender" TEXT,
    "age_from" INTEGER NOT NULL,
    "age_to" INTEGER NOT NULL,
    "frequency_months" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prevention_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preventions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "prevention_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preventions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preventions_user_id_prevention_id_key" ON "user_preventions"("user_id", "prevention_id");

-- AddForeignKey
ALTER TABLE "user_preventions" ADD CONSTRAINT "user_preventions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preventions" ADD CONSTRAINT "user_preventions_prevention_id_fkey" FOREIGN KEY ("prevention_id") REFERENCES "prevention_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
