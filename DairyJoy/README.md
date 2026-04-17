# Joy Diary · 悦记

一个专为疗愈而生的个人日记 app：

- 每日记录 **3 件开心的事**
- 结合你的生日（**1989.10.04 · 天秤座**）生成当日 **星座运势**
- 基于中国 **万年历** 给出当天的宜 / 忌 / 注意事项
- 接入 **ChatGPT** 可随时对话、问问题、获取更深度的解读

## 技术栈

- **后端**：Node.js · Express · MongoDB (Mongoose) · OpenAI SDK · lunar-javascript
- **前端**：React 18 · Vite · React Router · Axios · Framer Motion

## 目录结构

```
DairyJoy/
├── server/          # Express API
│   ├── models/      # Mongoose schemas
│   ├── routes/      # REST routes
│   └── services/    # OpenAI & 万年历 封装
├── client/          # React + Vite 前端
└── package.json     # 根目录脚本（concurrently）
```

## 快速开始

```bash
# 1. 安装所有依赖（根 + server + client）
npm run install-all

# 2. 启动前后端（server:5050 / client:5173）
npm run dev
```

浏览器打开 <http://localhost:5173>。

## 环境变量

已在 `server/.env` 预置好你提供的 **MongoDB URI** 和 **OpenAI API Key**。
如需修改请参考 `server/.env.example`。

```
MONGODB_URI=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
USER_NAME=Dzy
USER_BIRTHDAY=1989-10-04
USER_ZODIAC=libra
PORT=5050
```

## 生产部署

### 本地生产模式

```bash
npm run build   # 构建前端
npm start       # 启动生产服务器（提供静态资源 + API）
```

### 部署到 Vercel（一站式）

项目已配置好 `vercel.json`，Express 会作为 serverless 函数运行。

1. **推到 GitHub**（首次：确认 `.env` 已在 `.gitignore` 里）
2. Vercel 控制台 → **Import Git Repository** → 选这个仓库
3. **Root Directory** 设为 `DairyJoy/`（如果仓库里还有其它文件夹）
4. **Framework Preset** 选 `Other`
5. **Environment Variables**（必须！.env 不会被上传）：
   ```
   MONGODB_URI       mongodb+srv://...
   OPENAI_API_KEY    sk-proj-...
   OPENAI_MODEL      gpt-4o-mini
   USER_NAME         Dzy
   USER_BIRTHDAY     1989-10-04
   USER_ZODIAC       libra
   ```
6. Deploy — 之后每次 push 到 main 都会自动发版

**注意事项**：
- MongoDB Atlas 的 IP 白名单需要加 `0.0.0.0/0`（Vercel serverless 的出口 IP 不固定）
- Serverless 冷启动首次请求会慢 2–3 秒，之后温启动正常
- 函数超时设为 30s（够 OpenAI 回包），在 `vercel.json` 里可调
