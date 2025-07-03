# Python解释器路径（虚拟环境）
# /Users/zhangyujie/develop/backend/venv/bin/python
# 如果迁移目录或重建虚拟环境，请更新此路径

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
import re
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

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
                        "{\"dish_name\":\"菜名\",\"ingredients\":[\"食材\"],\"steps\":[\"步骤\"],\"tips\":\"小贴士\"}"
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

        return jsonify(reply_data)

    except Exception as e:
        return jsonify({"error": "服务内部异常", "detail": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)