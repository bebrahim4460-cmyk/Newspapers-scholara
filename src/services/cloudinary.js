// src/services/cloudinary.js

const CLOUD_NAME = "dai6ffucz"; 
const UPLOAD_PRESET = "scholara_preset"; 

export const uploadToCloudinary = async (file) => {
  if (!file) {
    console.warn("⚠️ تنبيه كلوديناري: الدالة استُدعيت ولكن لم يتم تمرير أي ملف لها!");
    return "";
  }

  console.log("🔄 رادار كلوديناري: جاري بدء رفع الصورة الآن إلى السيرفر...", file.name);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ سيرفر كلوديناري رفض الصورة وأعاد خطأ:", errorData);
      throw new Error(errorData.error?.message || "فشل الرفع إلى Cloudinary");
    }
    
    const data = await response.json();
    console.log("✅ رادار كلوديناري: تم الرفع بنجاح! الرابط المستلم هو:", data.secure_url);
    return data.secure_url; 
  } catch (error) {
    console.error("💥 خطأ فادح في الاتصال بكلوديناري:", error);
    throw error;
  }
};