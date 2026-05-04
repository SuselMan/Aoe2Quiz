# Aoe2Quiz — обзор проекта

## Что это
Мобильная (и web) викторина по Age of Empires II. Стек: **Expo SDK 54 / React Native 0.81 / React 19 / TypeScript / expo-router**. Платформы: Android (основная цель релиза), iOS, Web. Иконка/AAB конфигурируются под Android (`com.suselman.aoe2quiz`, versionCode 1, version 1.0.0).

## Структура
- `app/` — точка входа expo-router (`_layout.tsx`, `index.tsx`), плюс «толстый» state-machine (один экран рендерит всё через `screen` state). `gameData.ts` — загрузчик данных с `aoe2techtree.net/data/data.json` с локальным fallback (`app/data.json`). `strings.ts` + `strings_*.json` — игровые тексты (имена юнитов, описания).
- `src/screens/` — экраны: MainMenu, Settings, Support, LevelSelect, Result, GameOver, MultiplayerEntry/Searching/Result, TrainingSelect, Leaderboard, ProfileEdit.
- `src/components/` — `CampaignQuiz`, `TrainingQuiz`, `MultiplayerQuiz`, `TechTree` + UI-кнопки (`SoundPressable`, `AnswerButton`, `ResourcesButton`, `CommonButton`).
- `src/config/` — `difficulty.ts` (9 уровней Villager → King, 10–100 вопросов, 3 жизни), `questionTypes.ts` (~28 вариантов вопросов: цены/время/описания/уник.юниты/бонусы цив/ветки тех-дерева), `api.ts` (URL мультиплеера), `storageKeys.ts`.
- `src/i18n/` — **17 локалей**: en, ru, zh, tw, fr, de, hi, it, jp, ko, ms, pl, es, mx, tr, vi, br.
- `src/services/` — `socket.ts` (socket.io клиент: matchmaking, question, game_over, ready, answer), `leaderboard.ts` (REST `/api/leaderboard`).
- `src/context/` — `LanguageContext`, `MusicContext`.
- `src/utils/` — `deviceId` (uuid в AsyncStorage), `seededRandom`, `sounds`, `parseCivHelpTexts`, `storage` (обёртка над AsyncStorage).
- `assets/` — bg, иконки, шрифты (Balthazar=PlayfairDisplay, SpaceMono), QR-картинки для донатов (btc/eth/usdt-eth/usdt-tron).

## Режимы игры
1. **Single Player (Campaign)** — 9 уровней сложности по нарастающей, звёзды (макс. 3?) сохраняются в AsyncStorage, разблокировка следующего по ≥1 звезде.
2. **Training** — фокусированная отработка одного типа вопроса.
3. **Multiplayer (Competition)** — matchmaking через socket.io, рейтинг (Elo-like), результат сохраняется и показывается на лидерборде.
4. **Leaderboard** — топ + позиция игрока, поверх deviceId.

## Бэкенд
- Хост: `https://5re6.l.time4vps.cloud` (time4vps VPS).
- Транспорты: socket.io (events: `join_queue`, `leave_queue`, `match_found`, `matchmaking_timeout`, `question`, `ready`, `answer`, `game_over`) + REST `/api/leaderboard?deviceId=…`.
- Идентификация: `deviceId` (UUID) — без логина, имя+цив пользователь вводит сам.
- Кода сервера в этом репо **нет** (`server/` отсутствует), хотя README ссылается на `cd server && npm run dev`. Бекенд живёт отдельно.

## Сборка / релиз
- `eas.json`: profiles `development`, `preview` (apk internal), `production` (AAB + autoIncrement). Submit конфиг ждёт `./google-service-account.json`.
- `app.json`: `updates.enabled=false` (нет OTA-обновлений), `newArchEnabled=true`, `expo-build-properties` фиксирует Kotlin 2.0.21.
- `android/` в `.gitignore` — EAS делает prebuild при каждом билде.
- Подробный чеклист релиза уже описан в `RELEASE_ANDROID.md`.
- `patches/react-native+0.81.5.patch` — патч `std::format` → `std::to_string` для совместимости компилятора (NDK).

## Донаты
- Экран `SupportScreen` показывает 4 крипто-адреса (BTC, ETH, USDT-ERC20, USDT-TRC20) с QR-картинками и кнопкой «копировать».
- Boosty/Patreon в коде есть, но **закомментированы**.
- Авто-показ поддержки: модалка появляется один раз после **15** сыгранных игр (`STORAGE_KEYS.supportModalShown`). Кнопки `1 / 2 / 14` — намеренная пасхалка: это голосовые команды AoE2 (yes / no / start the game already), фанаты узнают.

## Хранилище (AsyncStorage)
`@aoe2quiz/{language, stars, deviceId, multiplayerName, multiplayerCiv, multiplayerRating, musicEnabled, totalGamesPlayed, supportModalShown}`.

## Звук / шрифты / визуал
- Музыка тогглится в Settings (MusicContext).
- Звуки: button click (preload), победа, начало игры — через `expo-av`.
- Один шрифт: PlayfairDisplay под именем `Balthazar`.

## Тесты / линт / CI
- `jest-expo` подключён, но **тестов проекта нет**.
- `expo lint` доступен скриптом, конфиг по умолчанию.
- CI/CD не настроен.

## Что использует внешнего
- **AoE2 данные** — `aoe2techtree.net/data/data.json` (live fetch, fallback на локальный `app/data.json`). Иконки цив тоже идут оттуда (см. `getCivIconUri`).
- **Шрифты, звуки** — локально.

---

# К релизу: что нужно / что подумать

## Жёстко обязательное для Google Play

1. **Privacy Policy (URL)** — Play Console не даст опубликовать без неё. Приложение собирает: deviceId (UUID), имя/цив игрока (видны другим в лидерборде), счёт игр. Это «персональные данные» в формулировках Google. Нужно сделать одностраничный сайт/Gist/GitHub Pages.
2. **Data safety форма** в консоли — расписать, что собирается (ник, deviceId, игровой прогресс), куда отправляется (свой бекенд), шифруется ли в transit (HTTPS — да), удаляется ли по запросу (нужно решить и описать процедуру).
3. **Content rating** — анкета в консоли (для викторины обычно «Everyone»).
4. **Target API level** — Expo 54 уже целит на свежий API, ок. Убедиться, что AAB собирается с актуальным targetSdk.
5. **Скриншоты / иконка / feature graphic / описания** — минимум по требованиям Play (en + желательно несколько локалей, под которые уже сделан перевод UI — это огромный плюс для discoverability).
6. **Дисклеймер про IP**: «Aoe2Quiz is an unofficial fan-made app. Age of Empires is a trademark of Microsoft Corporation. This app is not affiliated with or endorsed by Microsoft / Xbox Game Studios.» Положить и в стор-листинг, и в Settings/Support/About внутри приложения. Это сильно снижает риск удаления.

## Серьёзно стоит сделать перед релизом

7. **Донаты в крипте — риск**. Google Play политика по «in-app payments» формально запрещает обход Play Billing, а по теме криптовалют формулировки расплывчаты, но crypto-donations внутри приложения **периодически снимают** с публикации. Безопаснее: вынести «Поддержать» в `Linking.openURL` на внешнюю web-страницу (например, GitHub Pages) с теми же адресами, а внутри приложения только кнопка «Open donation page». Boosty/Patreon без проблем работают через внешний линк.
8. **Локализация Support-модалки**. Кнопки `1 / 2 / 14` — это AoE2-пасхалка (taunts), оставить как есть. Но заголовок «Do you like Aoe2Quiz?…» и disclaimer «We will never show you this window again» сейчас захардкожены на en — стоит вынести в i18n, либо явно решить, что текст модалки не локализуется.
9. **Модерация ников в мультиплеере** — имена игроков попадают в публичный лидерборд. Без хотя бы базового профанити-фильтра (на сервере) или кнопки report/ban это потенциально жалоба → удаление. Минимум: server-side blacklist + ограничение длины и символов.
10. **Стабильность бекенда** — `5re6.l.time4vps.cloud` это VPS на time4vps. Если он упадёт после релиза — отвалится мультиплеер и лидерборд (single-player работает оффлайн, это хорошо). Подумать про:
    - бэкап/мониторинг (uptime-pinger типа UptimeRobot, бесплатный),
    - что приложение делает при недоступном сервере (уже есть `socketConnected` флаг и серый «Competition» — это норм, но Leaderboard просто покажет «Failed to fetch» — лучше понятнее),
    - graceful degradation: при отсутствии сервера явно сказать «multiplayer offline, try later».
11. **Crash reporting** — добавить Sentry (бесплатный план хватит). Без него любой краш у пользователя останется невидимым; с Expo подключается одной командой.
12. **Подпись (Play App Signing)** — убедись, что при первой загрузке AAB включаешь Google Play App Signing, иначе потом сменить keystore почти невозможно.
13. **Backup стратегия для AsyncStorage** — Android по умолчанию делает auto-backup пользовательских данных через Google Drive. Это значит, что прогресс игрока **частично** перенесётся при переустановке. Если этого не хочется (или наоборот хочется явно) — настроить `android:allowBackup` и `dataExtractionRules`. Сейчас оно дефолтное.
14. **Сайдэффекты `aoe2techtree.net`**. Если их домен упадёт или сменит формат, fallback есть, но иконки цив грузятся с их хоста через `getCivIconUri` — без них multiplayer/leaderboard визуально сломаются. Подумать про прокси через свой сервер или локальную копию иконок.

## Хорошо бы, но не блокер

15. **Тесты** — хотя бы smoke-тест генератора вопросов и unit на `seededRandom` (он критичен для синхронности мультиплеера).
16. **EAS Update** включить позже — позволит править тексты/мелкие баги без пере-загрузки в Play.
17. **Android adaptive icon** уже настроен, но проверь как он выглядит в Pixel Launcher / Samsung One UI (часто фон обрезается).
18. **Локализация стор-листинга** — у тебя 17 переводов UI, грех не сделать listing хотя бы для топ-5 (en/ru/es/de/pt-BR/zh).
19. **Кнопка обратной связи** — email/Discord/Telegram. Полезно для багов и для того, чтобы пользователи не оставляли низкие оценки молча.
20. **Версионирование** — `app.json` версия 1.0.0; решить, как нумеровать (semver), и держать в синке с `versionCode` (autoIncrement в EAS уже включён, ок).

## Что **не** нужно тратить силы на

- **Реклама (AdMob)** — раз цели заработка нет, не подключай. Реклама добавляет ещё одну пачку требований по privacy/COPPA/AdMob policy.
- **In-app purchases** — раз только донаты, IAP не нужен (но см. п. 7 про крипту).
- **Продвинутая аналитика** — без монетизации это лишняя нагрузка на privacy policy. Sentry для крашей хватает.

---

## TL;DR для релиза
**Без чего нельзя пушить в Play:** privacy policy, data safety, content rating, скриншоты, дисклеймер про IP Microsoft.
**Главный риск:** крипто-донаты внутри приложения — лучше вынести в external link.
**Главный технический риск:** бекенд — single point of failure, добавить мониторинг и graceful UI при его падении.
