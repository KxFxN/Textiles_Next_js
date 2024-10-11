"use client";

import { useState } from "react";
import { Input, Button, Radio, RadioGroup } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fristname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    businessType: "",
    legalEntity: "หจก.",
    otherLegalEntity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLegalEntityChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      legalEntity: value,
      otherLegalEntity: value === "other" ? prevState.otherLegalEntity : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      //   const res = await fetch(
      //     `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(formData),
      //     }
      //   );

      //   if (!res.ok) throw new Error("Failed to register user");

      router.push("/");
    } catch (error) {
      console.error("Error registering user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-teal-400 to-green-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          กรุณากรอกข้อมูล
        </h1>
        <h2 className="text-lg md:text-xl text-center mb-4">
          เพื่อเริ่มต้น<span className="text-blue-500">การประเมินศักยภาพ</span>
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          โปรดกรอกข้อมูลด้านล่างให้ครบถ้วน
          เพื่อให้การประเมินมีความแม่นยำและเหมาะสมกับองค์กรของท่าน
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ชื่อ"
              name="fristname"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <Input
              label="นามสกุล"
              name="lastname"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <Input
              label="อีเมล์"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <Input
              label="เบอร์โทรศัพท์"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="รหัสผ่าน"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <Input
              label="ยืนยันรหัสผ่าน"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <Input
            label="ชื่อบริษัท"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            fullWidth
          />
          <Input
            label="ประเภทธุรกิจ"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            // placeholder="เช่น ร้านอาหาร, ขายสินค้าออนไลน์ ฯลฯ"
            required
            fullWidth
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              เลือกประเภทนิติบุคคล
            </label>
            <RadioGroup
              value={formData.legalEntity}
              onValueChange={handleLegalEntityChange}
              orientation="vertical"
            >
              <Radio value="หจก.">ห้างหุ้นส่วนจำกัด (หจก.)</Radio>
              <Radio value="บจก.">บริษัทจำกัด (บจก.)</Radio>
              <Radio value="บมจ.">บริษัทมหาชนจำกัด (บมจ.)</Radio>
              <Radio value="other">อื่น ๆ (โปรดระบุ)</Radio>
            </RadioGroup>
          </div>
          {formData.legalEntity === "other" && (
            <Input
              label="ระบุประเภทนิติบุคคล"
              className="mt-2 ml-6"
              name="otherLegalEntity"
              value={formData.otherLegalEntity}
              onChange={handleChange}
              fullWidth
            />
          )}
          <Button
            type="submit"
            color="success"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            ยืนยันข้อมูล
          </Button>
        </form>
      </div>
    </div>
  );
}
