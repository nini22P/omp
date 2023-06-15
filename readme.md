![omp](https://github.com/nini22P/omp/assets/60903333/20d360cb-976e-4915-91a8-829ed2fd61e5)

# OMP - OneDrive Media Player

Open your browser and **[Now Play](https://nini22p.github.io/omp/)**

## Development

1. Go to <https://portal.azure.com/>
2. Into `App registrations` register an application
3. `Supported account types` select the third item (`Accounts in any organizational directory and personal Microsoft accounts`)
4. `Redirect URI` select `SPA`, url enter <http://localhost:5173/>
5. Add `.env.development` in project path

```env
VITE_CLIENT_ID=<clientId>
VITE_REDIRECTURI=http://localhost:5173/
```

6. Run `npm i && npm run dev`

## License

[AGPL 3.0](https://github.com/nini22P/omp/blob/main/LICENSE)
