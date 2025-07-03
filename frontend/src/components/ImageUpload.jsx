import React, { useState } from "react";
import axios from "axios";

export default function ImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setResult("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("请先选择图片");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    setLoading(true);
    try {
      const resp = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(resp.data.dish_name || "未识别出菜品");
    } catch (err) {
      console.error(err);
      alert("上传或识别失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">菜品图片识别</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {loading ? "识别中..." : "上传并识别"}
        </button>
      </form>
      {result && (
        <div className="mt-4 text-center">
          <p>识别结果: <strong>{result}</strong></p>
        </div>
      )}
    </div>
  );
}