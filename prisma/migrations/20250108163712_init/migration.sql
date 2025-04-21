/*
  Warnings:

  - Added the required column `discription` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_category_name_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_district_name_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "discription" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone_number" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_district_name_fkey" FOREIGN KEY ("district_name") REFERENCES "District"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_category_name_fkey" FOREIGN KEY ("category_name") REFERENCES "Category"("name") ON DELETE CASCADE ON UPDATE CASCADE;
