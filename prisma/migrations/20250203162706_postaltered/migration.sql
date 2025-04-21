/*
  Warnings:

  - You are about to drop the column `details` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Post` table. All the data in the column will be lost.
  - The `image` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `area` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bathroom` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discription` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "details",
DROP COLUMN "name",
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "bathroom" INTEGER NOT NULL,
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "discription" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];
