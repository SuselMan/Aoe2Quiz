# Aoe2Quiz — GitHub Pages

Эта папка публикуется через [GitHub Pages](https://pages.github.com/) и содержит:

- `index.html` — лэндинг с навигацией.
- `privacy.html` — Privacy Policy (этот URL указывается в Google Play Console).
- `support.html` — внешняя страница для крипто-донатов (на неё ссылается приложение через `Linking.openURL`, чтобы не нарушать политику Google Play по in-app crypto fundraising).
- `style.css` — общие стили.
- `qr/*.png` — QR-коды кошельков для страницы донатов.

## URL после публикации

`https://<USERNAME>.github.io/<REPO>/`

Например: `https://suselman.github.io/aoe2/`

Конкретные URL:
- Privacy Policy → `…/privacy.html`
- Support / донаты → `…/support.html`

## Как включить GitHub Pages

1. На GitHub: **Settings** → **Pages**.
2. **Build and deployment** → **Source**: *Deploy from a branch*.
3. **Branch**: `master` (или `main`), folder **/docs**.
4. **Save**. Через 1–2 минуты страницы будут доступны.

## Что нужно сделать после первой публикации

1. Скопировать URL `…/privacy.html` в Google Play Console → *Privacy policy*.
2. Подставить тот же URL в стор-листинг (поле «Privacy policy»).
3. В приложении заменить inline-страницу донатов на `Linking.openURL("https://…/support.html")`. Сейчас `src/screens/SupportScreen.tsx` показывает крипто-адреса прямо в приложении — это потенциальный риск для Google Play (политика по crypto donations расплывчата). Безопаснее: оставить экран с одной кнопкой «Open donation page», открывающей внешний URL.
4. Обновить дату «Last updated» в `privacy.html` (захардкожена в `<script>` внизу) на дату фактической публикации в Play.
5. Если меняются крипто-адреса — обновить и `support.html`, и `qr/*.png`, и сами адреса в `aoe2quiz/src/screens/SupportScreen.tsx`.

## Файлы обновлены / переписаны

Старая версия `index.html` была однофайловой privacy policy с формулировкой «не собираем имя», что противоречит реальности (мультиплеер собирает ник). Новая `privacy.html` описывает фактический сбор данных: device UUID, ник, цив, рейтинг, IP в логах сервера. Это важно для прохождения Data Safety review в Google Play.
