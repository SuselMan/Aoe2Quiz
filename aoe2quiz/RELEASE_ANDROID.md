# Релиз в Google Play (Aoe2Quiz)

Чеклист подготовки и публикации приложения в Google Play.

---

## 1. Конфигурация проекта (уже сделано)

- **app.json**: `version` (1.0.0), `android.package` (com.suselman.aoe2quiz), `android.versionCode` (1 для первого релиза). Плагин **expo-build-properties** с `android.kotlinVersion: "2.0.21"` — для совместимости KSP/Gradle и устранения предупреждения «kspVersion is not defined».
- **eas.json**: профили сборки и сабмита; для продакшена собирается **AAB** (Android App Bundle), не APK — так требует Google Play.

При следующих релизах увеличивай `version` в app.json (например 1.0.1) и при использовании EAS Build можно оставить `autoIncrement: true` — `versionCode` будет увеличиваться автоматически.

---

## 2. Аккаунт и приложение в Google Play

1. **Google Play Developer Account**  
   Регистрация: https://play.google.com/console/signup  
   Разовый взнос (около $25).

2. **Создать приложение** в [Google Play Console](https://play.google.com/console):  
   «Создать приложение» → указать название (Aoe2Quiz), язык по умолчанию, тип (приложение/игра).

3. **Заполнить обязательные разделы** (в левом меню):
   - **Политика конфиденциальности** — ссылка на страницу с политикой (обязательно для приложений с данными пользователей).
   - **Рейтинг контента** — анкета и получение рейтинга.
   - **Целевая аудитория и контент** — возрастные группы, реклама (есть/нет) и т.д.
   - **Реклама** — если рекламы нет, указать «Нет рекламы».
   - **Новости о приложении** — краткое и полное описание, скриншоты (минимум по требованиям консоли).

---

## 3. Сборка релизного AAB

### Важно: папка android/ не коммитится

Чтобы EAS Build не падал с ошибкой «No variants exist» у нативных модулей, папка **android/** добавлена в `.gitignore`. На сервере EAS при сборке сам запускает `expo prebuild` и генерирует актуальный Android-проект.

**Один раз выполни** (если android/ уже была в репозитории):

```bash
cd aoe2quiz
git rm -r --cached android
git commit -m "Stop tracking android/; EAS will prebuild on build"
git push
```

После этого при каждой сборке EAS будет создавать android/ заново — версии Gradle/AGP и нативных модулей будут совместимы.

### Вариант A: EAS Build (рекомендуется)

1. Установить EAS CLI и войти в Expo:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Привязать проект к Expo (если ещё не привязан):
   ```bash
   eas build:configure
   ```

3. Собрать production AAB для Android:
   ```bash
   eas build --platform android --profile production
   ```

4. Сборка выполнится в облаке Expo. По окончании в [expo.dev](https://expo.dev) → проект → Builds появится ссылка на скачивание **.aab**.

5. Перед сборкой убедись, что для продакшена используется нужный бекенд: в `.env` или при вызове `eas build` задай `EXPO_PUBLIC_MULTIPLAYER_SERVER_URL` (если нужно).

### Вариант B: Локальная сборка (без EAS)

Если используешь только локальный Android build:

```bash
cd android
./gradlew bundleRelease
```

AAB будет в `android/app/build/outputs/bundle/release/app-release.aab`.  
Для подписи нужен свой keystore (настроить в `android/app/build.gradle`).

---

## 4. Подпись приложения

- **Первый релиз**: при загрузке AAB в Play Console можно создать ключ подписи в Google (Play App Signing) и загрузить подписанный бандл (EAS подписывает по умолчанию своим ключом, либо можно настроить свой в EAS).
- **Повторные релизы**: использовать тот же ключ/настройки подписи, что и при первой загрузке.

В EAS: при первой сборке EAS создаёт keystore и сохраняет его у себя; для последующих сборок подпись будет совместима с уже загруженным приложением в Play, если не менять настройки.

---

## 5. Загрузка в Google Play

1. В Play Console: **Release** → **Production** (или тестовый трек).
2. **Create new release** → загрузить **.aab** (скачанный из EAS или из `android/app/build/...`).
3. Указать название релиза и при необходимости «Release notes».
4. Отправить на проверку (**Review release** / **Start rollout**).

Первый раз проверка может занять от нескольких часов до нескольких дней.

---

## 6. После публикации

- При следующих обновлениях: увеличивай `version` в **app.json** (например 1.0.1, 1.1.0).  
- При использовании EAS с `autoIncrement: true` — **versionCode** для Android увеличится автоматически при каждой production-сборке.
- Сохраняй те же настройки подписи и тот же `android.package`, иначе обновление не подставится к уже опубликованному приложению.

---

## Краткий чеклист

- [ ] Аккаунт разработчика Google Play
- [ ] Приложение создано в Play Console
- [ ] Политика конфиденциальности (URL) добавлена
- [ ] Рейтинг контента пройден
- [ ] Заполнены описание, скриншоты, иконка
- [ ] Собран AAB (`eas build --platform android --profile production` или локально)
- [ ] AAB загружен в Release → Production (или тестовый трек)
- [ ] Релиз отправлен на проверку
