# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm run start
   ```
   (или `npx expo start`)

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Backend URL и локальная сборка

Мультиплеер и таблица лидеров ходят на бекенд по URL из конфига (`app/config/api.ts`):

- **Режим разработки** (`npm run start`): по умолчанию `http://localhost:3000`. Запустите бекенд локально: `cd server && npm run dev`.
- **Локальное приложение + удалённый бекенд** (например, 5re6): создайте в корне `aoe2quiz` файл `.env` (скопируйте из `.env.example`) и задайте:
  ```env
  EXPO_PUBLIC_MULTIPLAYER_SERVER_URL=https://5re6.l.time4vps.cloud
  ```
  Затем `npm run start` — приложение будет стучаться на этот хост. Для быстрого переключения можно использовать `npm run start:remote` (тот же URL через скрипт).
- **Production-сборка** (APK/IPA или EAS): по умолчанию используется `https://5re6.l.time4vps.cloud`. Переопределить можно через переменную окружения при сборке: `EXPO_PUBLIC_MULTIPLAYER_SERVER_URL=...`.

Итог: для локальной разработки с беком на 5re6 — `.env` с `EXPO_PUBLIC_MULTIPLAYER_SERVER_URL=https://5re6.l.time4vps.cloud` и `npm run start`.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
