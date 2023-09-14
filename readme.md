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
- [x] Playlists Sync

## Screenshot

![omp](https://github.com/nini22P/omp/assets/60903333/9ebdf1af-e0f0-40b0-b90c-6f1795ccf2c3)

## FAQ

### Where is my data stored?

All of OMP data is stored in the `Apps / OMP` folder in your OneDrive. Where `history.json` is the history and `playlists.json` is the playlists. If you have lost your data, you can restore an older version by visiting the OneDrive web version.

### How to retrieve old versions of data after changing client IDs

The client ID has been changed in `v1.2.0`, you need to re-authorize it, and new data will be created in the new folder if you are using the old version.

First close OMP, then open `OneDrive / Apps`, find `OMP 1` folder, delete all files in it, then find `OMP` folder, move all files in it to `OMP 1` folder, delete `OMP` folder, and finally rename `OMP 1` folder to `OMP`.

## Running and Build

### App registrations

1. Go to <https://portal.azure.com/>
2. Into `App registrations` register an application
3. `Supported account types` select the third item (`Accounts in any organizational directory and personal Microsoft accounts`)
4. `Redirect URI` select `SPA`, url enter <http://localhost:8760>
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
