import React, { useState } from "react";//导入 React 库和 useState Hook，用于创建有状态的组件
import axios from "axios";//导入 axios 库，用于发送 HTTP 请求到后端 API

export default function FoodAnalysis() {//定义名为 FoodAnalysis 的函数组件
  const [foodName, setFoodName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);//定义三个状态变量：foodName 用于存储用户输入的美食名称，result 用于存储分析结果，loading 用于指示是否正在加载数据

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName.trim()) {
      alert("请输入美食名称");
      return;
    }//如果用户没有输入美食名称，则弹出提示并返回

    setLoading(true);//设置 loading 状态为 true，表示正在加载数据
    try {
      const resp = await axios.post("http://127.0.0.1:5000/analyze", { food: foodName.trim() });//发送 POST 请求到后端 API，传递用户输入的美食名称
      setResult(resp.data);//将后端返回的分析结果存储到 result 状态变量中
    } catch (err) {
      console.error(err);
      alert("分析失败，请检查后端服务或网络！");//如果请求失败，则在控制台输出错误信息，并弹出提示
    } finally {
      setLoading(false);
    }//无论请求成功还是失败，都将 loading 状态设置为 false，表示加载完成
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
  );//渲染组件的 JSX 结构，包括标题、表单和结果显示部分
}//导出 FoodAnalysis 组件，以便在其他文件中使用
