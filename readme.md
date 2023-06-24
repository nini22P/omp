<img height="100px" width="100px" alt="logo" src="https://github.com/nini22P/omp/assets/60903333/4c4ac2b7-1002-478a-bb15-a5756e352fec"/>

# OMP - OneDrive Media Player

English | [中文](./readme_cn.md)

**[Now Playing](https://nini22p.github.io/omp/)**

## Features

- [x] OneDrive Files View
- [x] Music Playback
- [x] Music Metadata
- [x] Video Playback
- [x] Play Queue
- [x] Dark Mode
- [x] Media Session
- [x] PWA
- [x] History Sync
- [ ] Playlists Sync

## Screenshot

![omp](https://github.com/nini22P/omp/assets/60903333/f74801dc-8f12-42db-9d83-814c0289093a)

## Development

1. Go to <https://portal.azure.com/>
2. Into `App registrations` register an application
3. `Supported account types` select the third item (`Accounts in any organizational directory and personal Microsoft accounts`)
4. `Redirect URI` select `SPA`, url enter <http://localhost:5173/>
5. `API Permissions` add `User.Read` `Files.Read` `Files.ReadWrite.AppFolder`
6. Add `.env.development` in project path

```env
VITE_CLIENT_ID=<clientId>
VITE_REDIRECTURI=http://localhost:5173/
```

6. Run `npm i && npm run dev`

## License

[AGPL 3.0](https://github.com/nini22P/omp/blob/main/LICENSE)
