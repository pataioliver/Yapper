# Yapper – Csevegőalkalmazás

A tesztelés megkönnyítése érdekében az alkalmazás elérhető ezen a linken is:  
👉 **https://yapper-ajz8.onrender.com/**

---

## Telepítés

### 1. Klónozd a repót

Amennyiben már rendelkezel a teljes állománnyal ezt a lépést kihagyhatod

```bash
git clone https://github.com/pataioliver/Yapper.git
cd Yapper
```

### 2. Környezeti változók

Mind a frontend, mind a backend mappában találsz egy `.env.example` fájlt.  
Másold át őket `.env` néven, és töltsd ki a szükséges értékeket!

```bash
# Backend oldalon
cd backend
cp .env.example .env

# Frontend oldalon
cd ../frontend
cp .env.example .env
```

A privát és publikus vapi kulcsokat a következőképpen tudod generálni:

```bash
web-push generate-vapid-keys --json
```

**Fontos:**  
- **Fejlesztői (dev) teszteléshez** az `.env` fájlokban a környezet legyen `development` (pl. `NODE_ENV=development`, `MODE=development`).
- **Prod módhoz** állítsd át mindenhol `production`-ra (pl. `NODE_ENV=production`, `MODE=production`).

---

## Lokális tesztelés

A projekt kétféleképpen futtatható helyben:

### Dev mód (fejlesztői mód)

Ebben a módban a frontend és a backend külön szerveren fut, így gyorsabb a fejlesztés és a hibakeresés.

**Fontos:**  
A frontend és a backend indítása **két külön terminált vagy shellt igényel**!  
Először indítsd el a backend-et, majd **nyiss egy új terminált**, és abban indítsd el a frontend-et.

**Backend indítása:**
```bash
cd backend
npm install
npm run dev
```

**Frontend indítása (új terminálban!):**
```bash
cd ../frontend
npm install
npm run dev
```

A frontend elérhető lesz: [http://localhost:5173](http://localhost:5173)

---

### Prod mód (éles mód)

Ebben a módban a frontend buildje a backend szerveren keresztül érhető el, azaz **egyazon végponton** fut a teljes alkalmazás.

**Frontend buildelése:**
```bash
cd frontend
npm install
npm run build
```

**Backend indítása (a buildelt frontenddel):**
```bash
cd ../backend
npm install
npm run start
```

Ezután a teljes alkalmazás a backend szerveren keresztül lesz elérhető [http://localhost:5001](http://localhost:5001), a frontend statikus fájljait a backend szolgálja ki.

---

## Automata tesztek futtatása

A projekt tartalmaz automata (Selenium alapú) végpont- és UI teszteket is, melyek a `frontend/tests` mappában találhatók.

**Fontos:**  
A tesztek futtatása **csak fejlesztői (dev) módban** lehetséges, mivel a backend ilyenkor adja vissza a teszteléshez szükséges extra adatokat (pl. verifikációs kód, jelszó reset link).

### Tesztek futtatása

1. Indítsd el a backend-et és a frontend-et **dev módban** (lásd fent).
2. Egy másik terminálban navigálj a `frontend/tests` mappába, majd futtasd a kívánt tesztet például így:
   ```bash
   node signup.with_verification.test.js
   ```
   vagy
   ```bash
   node send_message.test.js
   ```
3. **Alternatívaként** a frontend mappában az összes tesztet lefuttathatod az alábbi paranccsal:
   ```bash
   npm run test
   ```

A tesztek csak akkor működnek helyesen, ha a környezet fejlesztői módban fut (`NODE_ENV=development`).

---

## Gyorsindítás a projekt rootból

A projekt gyökerében kiadott  
```bash
npm run build
```
parancs automatikusan letölti a szükséges node modulokat a `backend` és a `frontend` mappákban, majd lefordítja a frontendet.

Alternatívaként a modulokat külön-külön is telepítheted:
```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## Szerzők

Készítette: **Baranya Gyula, Patai Olivér, Szabó Márton**