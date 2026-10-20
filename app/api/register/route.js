import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db"; // หรือใช้ชื่อ path ที่ถูกต้องของคุณ

export async function POST(request) {
  try {
    const { fullname, email, password } = await request.json();

    // 1. เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. บันทึกข้อมูลลงฐานข้อมูล
    await pool.query(
      "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
      [fullname, email, hashedPassword]
    );

    // ✅ ต้องมีคำสั่ง return นี้เมื่อสำเร็จ
    return NextResponse.json({ message: "Register successfully" }, { status: 201 });

  } catch (error) {
    console.error("Register error:", error);
    
    // ✅ ต้องมีคำสั่ง return นี้เช่นกันเมื่อเกิด Error
    return NextResponse.json(
      { message: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}