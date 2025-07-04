# Python解释器路径（虚拟环境）
# /Users/zhangyujie/develop/backend/venv/bin/python
# 如果迁移目录或重建虚拟环境，请更新此路径

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
import re
import glob
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# 本地图片文件夹路径（请确保已下载并解压Kaggle数据集到此目录）
LOCAL_IMAGE_DIR = os.path.join(os.path.dirname(__file__), 'static', 'food_images')

# 可选：图片API兜底（如Bing、百度等），需你补充API KEY和实现
# 示例：def search_image_online(dish_name): ...
def search_image_online(dish_name):
    # TODO: 你可以用百度、Bing等API实现自动图片搜索
    # 这里只返回一个占位图片
    return 'https://dummyimage.com/400x300/cccccc/000000&text=' + dish_name

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        query = data.get('query', '')

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }

        payload = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "你是食谱推荐助手，根据用户输入推荐食谱。"
                        "仅返回 JSON："
                        '{"dish_name":"菜名","ingredients":["食材"],"steps":["步骤"],"tips":"小贴士"}'
                        "不要返回解释或额外文字。"
                    )
                },
                {
                    "role": "user",
                    "content": query.strip()
                }
            ]
        }

        resp = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers)

        if resp.status_code != 200:
            return jsonify({"error": "DeepSeek 调用失败", "detail": resp.text}), 500

        result = resp.json()
        reply = result["choices"][0]["message"]["content"]
        print("AI 原始回复：", repr(reply))

        # 去掉AI返回中的代码块标记
        json_str = re.sub(r"^```json\s*|\s*```$", "", reply.strip(), flags=re.DOTALL)

        # 尝试解析 AI 返回的 JSON 内容
        try:
            reply_data = json.loads(json_str)
        except json.JSONDecodeError:
            return jsonify({"error": "AI 返回数据格式错误", "raw_reply": reply}), 500

        dish_name = reply_data.get('dish_name', '').strip()
        image_url = None
        # 1. 先查本地图片
        if dish_name:
            # 支持多种图片后缀
            pattern = os.path.join(LOCAL_IMAGE_DIR, f"{dish_name}.*")
            matches = glob.glob(pattern)
            if matches:
                # 返回第一个匹配图片的相对路径
                image_url = '/static/food_images/' + os.path.basename(matches[0])
        # 2. 本地没有则用API兜底
        if not image_url:
            image_url = search_image_online(dish_name)
        reply_data['image_url'] = image_url
        return jsonify(reply_data)

    except Exception as e:
        return jsonify({"error": "服务内部异常", "detail": str(e)}), 500
    

#上传图片功能前端代码

@app.route('/upload', methods=['POST'])

def upload_image():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "没有收到图片文件"}), 400
        
        image_file = request.files['image']

        if image_file.filename == '':
            return jsonify({"error": "文件名为空"}), 400
        
        print("收到图片上传请求：", image_file.filename)          #关注返回内容
        # 临时返回固定菜名（后面接机器学习模型）
        dish_name = "示例菜品"

        return jsonify({"dish_name": dish_name})

    except Exception as e:
        return jsonify({"error": "服务内部异常", "detail": str(e)}), 500


#调试方便 debug 可以不加
if __name__ == '__main__':
    app.run(port=5000, debug=True)