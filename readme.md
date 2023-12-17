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

## Screenshots

![203825](https://github.com/nini22P/omp/assets/60903333/83ee1913-ed11-4a73-add0-d5655eb451e9)
![203915](https://github.com/nini22P/omp/assets/60903333/35b0e1ce-8441-4b70-9ddb-96023b1c4f60)
![204043](https://github.com/nini22P/omp/assets/60903333/efdf3f0a-fd79-4875-ba51-c421d8730589)
![204226](https://github.com/nini22P/omp/assets/60903333/6c532070-8f77-4dc0-81a5-7c3efb2543bf)

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
