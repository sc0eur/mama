# CREDITS:

GMail Client Template was taken from https://github.com/elongineer/react-gmail-client


# Как запустить

Перейти в папку с контейнером:

`cd app`

Далее:

`sudo docker build -t hack .`

ВНИМАНИЕ! У контейнера очень большой размер(~9 GB).
Будьте готовы подождать.

Когда контейнер собран:

`sudo docker run -d -p 8000:8000 hack`

Когда он запущен и на `localhost:8000/` отображается `Привет`:

`npm install`

`npm start`

Если не хотите использовать свой Google-аккаунт, то мы создали тестовый:

`Логин: fin4l.sber@gmail.com `

`Пароль: fin4l.sberfin4l.sber`
