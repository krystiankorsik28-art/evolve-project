# Instrukcja wdrożenia proxy Edunex na nazwa.pl

## 1. Przesłanie plików proxy przez FTP

1. Połącz się z serwerem FTP przy użyciu poniższych danych:
   - **Host:** server724363.nazwa.pl
   - **User:** server724363.nazwa.pl
   - **Hasło:** (hasło do panelu nazwa.pl)
   - **Port:** 21
2. Po zalogowaniu przejdź do katalogu głównego (lub wybranego katalogu).
3. Rozpakuj `proxy-server.zip` i prześlij cały folder `proxy-server` na serwer (np. do katalogu `public_html/proxy` lub bezpośrednio jako osobny katalog).

## 2. Dodanie subdomeny proxy.edunex.pl

1. Zaloguj się do panelu klienta **nazwa.pl**.
2. Przejdź do **Domeny → Twoje domeny → edunex.pl**.
3. Kliknij **Dodaj domenę dodatkową** (lub Subdomeny).
4. Wpisz: `proxy.edunex.pl`
5. Wskaż katalog docelowy: np. `/proxy` lub `public_html/proxy` (tam gdzie przesłałeś pliki).
6. Zapisz zmiany.

## 3. Zmiana interpretera na Node.js

1. W panelu nazwa.pl przejdź do **WWW i FTP → PHP i Node.js** (lub w ustawieniach domeny znajdź opcję **Node.js**).
2. Wybierz subdomenę `proxy.edunex.pl`.
3. Włącz **Node.js** i ustaw:
   - **Wersja Node:** wybierz najnowszą dostępną (np. 18.x lub 20.x)
   - **Główny plik aplikacji:** `server.js`
   - **Zmienne środowiskowe (opcjonalnie):** `PORT` – domyślnie 3000, ale nazwa.pl często wymusza inny port (sprawdź w panelu). Jeśli nic nie ustawisz, aplikacja użyje `process.env.PORT || 3000`.
4. Zapisz i uruchom ponownie aplikację.

## 4. Konfiguracja DNS dla proxy.edunex.pl

1. W panelu nazwa.pl przejdź do **Domeny → edunex.pl → DNS**.
2. Sprawdź adres IP swojego konta w **Adres IP i RevDNS** (znajdziesz go w panelu → konto → szczegóły).
3. Dodaj rekord:
   - **Typ:** A
   - **Nazwa:** `proxy`
   - **Wartość:** (adres IP z panelu, np. `79.96.14.1` – przykładowo)
4. Zapisz zmiany. DNS propaguje się do 24h, ale zazwyczaj działa w ciągu kilku minut.

## 5. Uruchomienie proxy

Aplikacja uruchamia się automatycznie po włączeniu Node.js w panelu (krok 3). Jeśli potrzebujesz uruchomić ręcznie przez SSH:

```bash
cd katalog_z_proxy
node server.js
```

Domyślnie działa na porcie **3000**. Jeśli nazwa.pl wymusza inny port, ustaw zmienną środowiskową `PORT`.

## 6. Testowanie

1. Otwórz w przeglądarce: **http://proxy.edunex.pl/health**
2. Oczekiwana odpowiedź:
   ```json
   { "status": "ok" }
   ```
3. Jeśli widzisz `{ "status": "ok" }` – proxy działa poprawnie.

## 7. Aktualizacja frontendu

W pliku `src/components/EDziennik.tsx` znajdź linię z `proxyUrl` i zmień jej wartość na:

```ts
const proxyUrl = 'http://proxy.edunex.pl';
```

Po zmianie wdróż aplikację na Vercel (wystarczy push na gałąź `main` – Vercel zrobi automatyczny deploy).
