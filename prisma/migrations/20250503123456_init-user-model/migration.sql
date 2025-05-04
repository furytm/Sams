CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),  -- If you want to use UUIDs instead of cuid
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "contactNumber" TEXT NOT NULL,
  "schoolName" TEXT NOT NULL,
  "roleInSchool" TEXT NOT NULL,
  "studentSize" INTEGER NOT NULL,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "otp" TEXT,  -- Optional field
  "otpExpires" TIMESTAMPTZ, 
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-update updatedAt on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_update_user_updated_at
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
