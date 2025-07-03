import React from 'react';
import RecipeForm from './components/RecipeForm';

export default function App() {
  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center flex items-center justify-center">
   <div className="w-full max-w-5xl min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 flex flex-col items-center justify-center">
    <h1
      className="text-4xl font-extrabold text-center mb-6"
      style={{ fontFamily: "'Ma Shan Zheng', cursive" }}
    >
      智能食谱推荐系统
    </h1>
    <RecipeForm />
  </div>
</div>
  );
}