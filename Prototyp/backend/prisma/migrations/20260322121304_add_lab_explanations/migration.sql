-- CreateTable
CREATE TABLE "lab_explanations" (
    "id" SERIAL NOT NULL,
    "parameter" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "low_hint" TEXT NOT NULL,
    "high_hint" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_explanations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lab_explanations_parameter_key" ON "lab_explanations"("parameter");
