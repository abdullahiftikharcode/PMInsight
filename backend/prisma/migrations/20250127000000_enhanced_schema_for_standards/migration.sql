-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "standardId" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Chapter_standardId_idx" ON "Chapter"("standardId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_standardId_number_key" ON "Chapter"("standardId", "number");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN "chapterId" INTEGER;
ALTER TABLE "Section" ADD COLUMN "fullTitle" TEXT;
ALTER TABLE "Section" ADD COLUMN "wordCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Section" ADD COLUMN "sentenceCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Standard" ADD COLUMN "type" TEXT;
ALTER TABLE "Standard" ADD COLUMN "version" TEXT;
ALTER TABLE "Standard" ADD COLUMN "description" TEXT;

-- CreateIndex
CREATE INDEX "Section_chapterId_idx" ON "Section"("chapterId");
CREATE INDEX "Section_sectionNumber_idx" ON "Section"("sectionNumber");
CREATE UNIQUE INDEX "Section_standardId_sectionNumber_key" ON "Section"("standardId", "sectionNumber");
CREATE INDEX "Standard_type_idx" ON "Standard"("type");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
