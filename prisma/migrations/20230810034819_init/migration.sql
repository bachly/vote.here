-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "form1Answer" JSONB,
    "form2Answer" JSONB,
    "form3Answer" JSONB,
    "form4Answer" JSONB,
    "form5Answer" JSONB,
    "form6Answer" JSONB,
    "form7Answer" JSONB,
    "form8Answer" JSONB,
    "form9Answer" JSONB,
    "form10Answer" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "formId" TEXT NOT NULL DEFAULT '',
    "text" TEXT NOT NULL DEFAULT '',
    "choices" JSONB,
    "status" TEXT NOT NULL DEFAULT '',
    "maxchoices" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);
