import React from 'react';
import RecipeForm from './components/RecipeForm';    //引入菜单
import ImageUpload from './components/ImageUpload';   //引入图片文件


export default function App() {
  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center flex items-center justify-center">
      <div className="w-full max-w-5xl  bg-gradient-to-br from-blue-100 to-purple-100 p-4 flex flex-col items-center justify-start gap-0">
    <h1
      className="text-4xl font-extrabold text-center mb-0"
      style={{ fontFamily: "'Ma Shan Zheng', cursive" }}
    >
      智能食谱推荐系统
    </h1>
    <RecipeForm />
    
       <div className="my-0 border-t border-gray-300 w-3/4 mx-auto"></div>  {/* 分隔线美化，灰色，宽度缩小居中 */}
    <ImageUpload />

  </div>
</div>
  );
}