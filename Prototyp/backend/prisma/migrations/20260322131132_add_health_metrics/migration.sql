-- CreateTable
CREATE TABLE "health_metrics" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "steps" INTEGER NOT NULL,
    "heart_rate_avg" INTEGER NOT NULL,
    "heart_rate_min" INTEGER NOT NULL,
    "heart_rate_max" INTEGER NOT NULL,
    "sleep_hours" DOUBLE PRECISION NOT NULL,
    "sleep_quality" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "health_metrics_user_id_date_key" ON "health_metrics"("user_id", "date");

-- AddForeignKey
ALTER TABLE "health_metrics" ADD CONSTRAINT "health_metrics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
