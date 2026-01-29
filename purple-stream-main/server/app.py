from flask import Flask, request, jsonify
import sqlite3
import time
import json

app = Flask(__name__)

# 配置数据库
DATABASE = 'danmu.db'

# 初始化数据库
def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS danmu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        color TEXT DEFAULT '#ffffff',
        timestamp INTEGER DEFAULT 0
    )
    ''')
    conn.commit()
    conn.close()

# 初始化数据库
init_db()

# 获取所有弹幕
@app.route('/api/danmu', methods=['GET'])
def get_danmu():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT id, content, color, timestamp FROM danmu ORDER BY timestamp DESC')
    danmus = cursor.fetchall()
    conn.close()
    
    result = []
    for danmu in danmus:
        result.append({
            'id': danmu[0],
            'content': danmu[1],
            'color': danmu[2],
            'timestamp': danmu[3]
        })
    
    return jsonify({
        'success': True,
        'danmakus': result
    })

# 发送新弹幕
@app.route('/api/danmu', methods=['POST'])
def post_danmu():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({
            'success': False,
            'error': 'Missing text parameter'
        }), 400
    
    content = data['text']
    color = data.get('color', '#ffffff')
    timestamp = int(time.time())
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO danmu (content, color, timestamp) VALUES (?, ?, ?)
    ''', (content, color, timestamp))
    conn.commit()
    
    # 获取新插入的弹幕ID
    danmu_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'danmaku': {
            'id': danmu_id,
            'content': content,
            'color': color,
            'timestamp': timestamp
        }
    })

# 处理CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)