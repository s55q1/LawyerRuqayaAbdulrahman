import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash("123456", 12);

  // 1. MANAGER
  const manager = await prisma.user.upsert({
    where: { email: "manager@lawoffice.sa" },
    update: { role: "MANAGER", password: defaultPassword },
    create: {
      name: "المدير العام",
      email: "manager@lawoffice.sa",
      password: defaultPassword,
      role: "MANAGER",
      phone: "0500000001",
    },
  });

  // 2. CONTENT_MANAGER
  const contentManager = await prisma.user.upsert({
    where: { email: "content@lawoffice.sa" },
    update: { role: "CONTENT_MANAGER", password: defaultPassword },
    create: {
      name: "مدير المحتوى",
      email: "content@lawoffice.sa",
      password: defaultPassword,
      role: "CONTENT_MANAGER",
      phone: "0500000002",
    },
  });

  // 3. ACCOUNTANT
  const accountant = await prisma.user.upsert({
    where: { email: "accountant@lawoffice.sa" },
    update: { role: "ACCOUNTANT", password: defaultPassword },
    create: {
      name: "المحاسب المالي",
      email: "accountant@lawoffice.sa",
      password: defaultPassword,
      role: "ACCOUNTANT",
      phone: "0500000003",
    },
  });

  // 4. HR_MANAGER
  const hrManager = await prisma.user.upsert({
    where: { email: "hr@lawoffice.sa" },
    update: { role: "HR_MANAGER", password: defaultPassword },
    create: {
      name: "مدير الموارد البشرية",
      email: "hr@lawoffice.sa",
      password: defaultPassword,
      role: "HR_MANAGER",
      phone: "0500000004",
    },
  });

  // 5. LAWYER
  const lawyer = await prisma.user.upsert({
    where: { email: "lawyer@lawoffice.sa" },
    update: { role: "LAWYER", password: defaultPassword },
    create: {
      name: "المحامي الأساسي",
      email: "lawyer@lawoffice.sa",
      password: defaultPassword,
      role: "LAWYER",
      phone: "0500000005",
    },
  });

  // 6. ADVISOR
  const advisor = await prisma.user.upsert({
    where: { email: "advisor@lawoffice.sa" },
    update: { role: "ADVISOR", password: defaultPassword },
    create: {
      name: "المستشار القانوني",
      email: "advisor@lawoffice.sa",
      password: defaultPassword,
      role: "ADVISOR",
      phone: "0500000006",
    },
  });

  // 7. SECRETARY
  const secretary = await prisma.user.upsert({
    where: { email: "secretary@lawoffice.sa" },
    update: { role: "SECRETARY", password: defaultPassword },
    create: {
      name: "السكرتير القانوني",
      email: "secretary@lawoffice.sa",
      password: defaultPassword,
      role: "SECRETARY",
      phone: "0500000007",
    },
  });

  // 8. RECEPTIONIST
  const receptionist = await prisma.user.upsert({
    where: { email: "reception@lawoffice.sa" },
    update: { role: "RECEPTIONIST", password: defaultPassword },
    create: {
      name: "موظف الاستقبال",
      email: "reception@lawoffice.sa",
      password: defaultPassword,
      role: "RECEPTIONIST",
      phone: "0500000008",
    },
  });

  // Clean old dummy data that might conflict (e.g. users not in the 8 roles)
  const allowedEmails = [
    "manager@lawoffice.sa", "content@lawoffice.sa", "accountant@lawoffice.sa",
    "hr@lawoffice.sa", "lawyer@lawoffice.sa", "advisor@lawoffice.sa",
    "secretary@lawoffice.sa", "reception@lawoffice.sa"
  ];
  await prisma.user.deleteMany({
    where: { email: { notIn: allowedEmails } }
  });


  // Add a dummy client to avoid dropping relations if needed
  const dummyClient = await prisma.client.upsert({
    where: { nationalId: "1000000000" },
    update: {},
    create: {
      name: "عميل تجريبي",
      nationalId: "1000000000",
      phone: "0599999999",
    }
  });

  console.log("✅ تم بناء الـ 8 حسابات بنجاح وإزالة القديم.");
  console.log("كلمة المرور الموحدة: 123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
