import React, { useState } from "react";
import axios from "axios";

export default function FoodAnalysis() {
  const [foodName, setFoodName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName.trim()) {
      alert("请输入美食名称");
      return;
    }

    setLoading(true);
    try {
      const resp = await axios.post("http://127.0.0.1:5000/analyze", { food: foodName.trim() });
      setResult(resp.data);
    } catch (err) {
      console.error(err);
      alert("分析失败，请检查后端服务或网络！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">美食营养分析</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="请输入美食名称（例如：红烧肉）"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="border p-2 rounded"
        />
        {/* 进度条开始 */}
        {loading && (
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-2 bg-green-400 rounded animate-pulse" style={{ width: "100%" }}></div>
          </div>
        )}
        {/* 进度条结束 */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {loading ? "分析中..." : "开始分析"}
        </button>
      </form>
      {result && (
        <div className="mt-4 text-left">
          <p><strong>热量:</strong> {result.calories}</p >
          <p><strong>营养成分:</strong> {result.nutrition}</p >
          <p><strong>忌口人群或食用风险:</strong> {result.warning}</p >
        </div>
      )}
    </div>
  );
}