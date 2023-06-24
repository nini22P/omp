<img height="100px" width="100px" alt="logo" src="https://github.com/nini22P/omp/assets/60903333/4c4ac2b7-1002-478a-bb15-a5756e352fec"/>

# OMP - OneDrive 媒体播放器

[English](./readme.md) | 中文

**[立即播放](https://nini22p.github.io/omp/)**

## 功能

- [x] OneDrive 文件查看
- [x] 音乐播放
- [x] 音乐元数据
- [x] 视频播放
- [x] 播放队列
- [x] 黑暗模式
- [x] Media Session
- [x] PWA
- [x] 播放历史同步
- [ ] 播放列表同步

## 截图

![omp](https://github.com/nini22P/omp/assets/60903333/f74801dc-8f12-42db-9d83-814c0289093a)

## 开发

1. 打开 <https://portal.azure.com/>
2. 进入 `应用注册` 添加一个新应用
3. `支持账户类型` 选择第三项 (`任何组织目录中的帐户和个人 Microsoft 帐户`)
4. `重定向 URI` 选择 `SPA`, url 输入 <http://localhost:5173/>
5. `API 权限` 添加 `User.Read` `Files.Read` `Files.ReadWrite.AppFolder`
6. 在项目路径添加 `.env.development`

```env
VITE_CLIENT_ID=<clientId>
VITE_REDIRECTURI=http://localhost:5173/
```

6. 运行 `npm i && npm run dev`

## 许可

[AGPL 3.0](https://github.com/nini22P/omp/blob/main/LICENSE)
