import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verifyToken";

export async function GetQuestion() {
  try {
    // ดึง token และ refreshToken จาก cookie
    // const cookieStore = cookies();
    // const token = cookieStore.get("token")?.value;
    // const refreshToken = cookieStore.get("refreshToken")?.value;

    // if (!token) {
    //   throw new Error("Token not found in cookies");
    // }

    // // ถอดรหัส token
    // const decodedToken = await verifyToken(token);

    // if (!decodedToken) {
    //   throw new Error("Invalid token");
    // }

    // // สร้าง cookie string
    // const cookieString = `token=${token}; refreshToken=${refreshToken}`;

    // ดำเนินการ fetch ข้อมูล
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/question`, {
      method: "GET",
      // headers: {
      //   Cookie: cookieString,
      // },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return await res.json();
  } catch (error) {
    console.error("Error in GetResultByUserID:", error.message);
    throw error;
  }
}

export async function GetQuestionCount() {
  try {
    // ดึง token และ refreshToken จาก cookie
    // const cookieStore = cookies();
    // const token = cookieStore.get("token")?.value;
    // const refreshToken = cookieStore.get("refreshToken")?.value;

    // if (!token) {
    //   throw new Error("Token not found in cookies");
    // }

    // // ถอดรหัส token
    // const decodedToken = await verifyToken(token);

    // if (!decodedToken) {
    //   throw new Error("Invalid token");
    // }

    // // สร้าง cookie string
    // const cookieString = `token=${token}; refreshToken=${refreshToken}`;

    // ดำเนินการ fetch ข้อมูล
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/question/count`,
      {
        method: "GET",
        // headers: {
        //   Cookie: cookieString,
        // },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return await res.json();
  } catch (error) {
    console.error("Error in GetResultByUserID:", error.message);
    throw error;
  }
}
