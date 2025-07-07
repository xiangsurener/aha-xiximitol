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
          {/* 口味输入框：用于输入用户的口味偏好 */}
          
          <label className="font-semibold text-gray-700" htmlFor="flavor-input">口味：</label>
          <input
            id="flavor-input"
            className="border p-2 rounded w-full text-base"
            style={{ minWidth: '400px' }}
            placeholder="口味偏好（例如微辣、清淡）"
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            required
          />
          
          <label className="font-semibold text-gray-700" htmlFor="ingredients-input">食材：</label>
          <input
            id="ingredients-input"
            className="border p-2 rounded w-full text-base"
            style={{ minWidth: '400px' }}
            placeholder="主要食材（例如鸡肉、土豆）"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
          <label className="font-semibold text-gray-700" htmlFor="avoid-input">忌口：</label>
          <input
            id="avoid-input"
            className="border p-2 rounded w-full text-base"
            style={{ minWidth: '400px' }}
            placeholder="忌口（例如花生、海鲜）"
            value={avoid}
            onChange={(e) => setAvoid(e.target.value)}
          />
          {/* 进度条，仅在 loading 时显示 */}
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-full bg-blue-200 rounded h-4 overflow-hidden">
                <div className="bg-blue-500 h-4 rounded animate-pulse w-full"></div>
              </div>
              <span className="text-blue-600 text-xs whitespace-nowrap">加载中...</span>
            </div>
          )}
          {/* 进度条结束 */}
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
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