<img height="100px" width="100px" alt="logo" src="https://github.com/nini22P/omp/assets/60903333/e2c099c6-15ad-46f1-a716-cb440b06c13e"/>

# OMP - OneDrive Media Player

![ci](https://github.com/nini22P/omp/actions/workflows/ci.yml/badge.svg)
<a href="https://afdian.net/a/nini22P"><img alt="Afdaian" style="height: 30px;" src="https://pic1.afdiancdn.com/static/img/welcome/button-sponsorme.png"></a>
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/nini22p)

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
- [x] Playlists Sync

## Screenshots

![140335](https://github.com/nini22P/omp/assets/60903333/ced9eae1-9f04-48b9-8d03-83d8e65083d9)
![235819](https://github.com/nini22P/omp/assets/60903333/ea6b9ec2-d52f-4243-9450-d9cbab633fac)
![000122](https://github.com/nini22P/omp/assets/60903333/bd776c79-ec3c-4f35-9b8b-534927ff980b)
![000452](https://github.com/nini22P/omp/assets/60903333/5ad2565b-ff8c-439b-9f91-b1edcb7e24fa)

## FAQ

### Where is my data stored?

All of OMP data is stored in the `Apps / OMP` folder in your OneDrive. Where `history.json` is the history and `playlists.json` is the playlists. If you have lost your data, you can restore an older version by visiting the OneDrive web version.

## Running and Build

### App registrations

1. Go to <https://portal.azure.com/>
2. Into `App registrations` register an application
3. `Supported account types` select the third item (`Accounts in any organizational directory and personal Microsoft accounts`)
4. `Redirect URI` select `SPA`, url enter <http://localhost:8760> or the domain of your deploy
5. `API Permissions` add `User.Read` `Files.Read` `Files.ReadWrite.AppFolder`

### Run dev server

Add `.env.development` in project path

```env
CLIENT_ID=<clientId>
REDIRECT_URI=http://localhost:8760
```

Run `npm i && npm run dev`

### Local build

Add `.env` in project path

```env
CLIENT_ID=<clientId>
REDIRECT_URI=<redirectUri>
```

Run `npm i && npm run build`

## License

[AGPL 3.0](https://github.com/nini22P/omp/blob/main/LICENSE)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nini22P/omp&type=Date)](https://star-history.com/#nini22P/omp&Date)
