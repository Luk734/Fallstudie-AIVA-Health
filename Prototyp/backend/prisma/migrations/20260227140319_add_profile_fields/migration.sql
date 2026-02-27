-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "last_name" TEXT;
