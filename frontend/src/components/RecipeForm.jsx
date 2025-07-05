//前端运行 JS
// RecipeForm.jsx
// 智能食谱推荐系统前端组件
// 用于输入食材、口味、禁忌等信息，调用后端推荐食谱并展示结果

// 前端运行方法：在项目根目录下执行 cd frontend，然后运行 npm install && npm run dev
import React, { useState } from 'react';
import axios from 'axios';

export default function RecipeForm() {
  const [flavor, setFlavor] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [avoid, setAvoid] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const query = `口味: ${flavor}。食材: ${ingredients}。忌口: ${avoid}。`;
    try {
      const resp = await axios.post('http://127.0.0.1:5000/recommend', { query });
      setRecipe(resp.data);
    } catch (err) {
      console.error(err);
      alert('获取推荐失败，请检查后端服务或网络！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-blue-100 to-purple-100 flex justify-center items-start p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6">您的个性化定制</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border p-2 rounded"
            placeholder="口味偏好（例如微辣、清淡）"
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="主要食材（例如鸡肉、土豆）"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="忌口（例如花生、海鲜）"
            value={avoid}
            onChange={(e) => setAvoid(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            type="submit"
            disabled={loading}
          >
            {loading ? '推荐中...' : '获取推荐'}
          </button>
        </form>

        {recipe && Object.keys(recipe).length > 0 ? (
          <div className="mt-6 bg-gray-50 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{recipe.dish_name}</h2>
            <p className="font-semibold">食材:</p>
            <ul className="list-disc pl-5 mb-2">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="font-semibold">步骤:</p>
            <ol className="list-decimal pl-5 mb-2">
              {recipe.steps.map((step, idx) => (
                <li key={idx}>
              {step.replace(/^\d+\.\s*/, '')}
                </li>
              ))}
            </ol>
            <p className="font-semibold">小贴士:</p>
            <p>{recipe.tips}</p>
          </div>
        ) : recipe ? (
          <div className="mt-4 text-red-500">未检测到有效食谱请求，请输入食材或口味信息。</div>
        ) : null}
      </div>
    </div>
  );
}