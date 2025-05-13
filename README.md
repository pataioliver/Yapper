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

**Fontos:**  
- **Fejlesztői (dev) teszteléshez** az `.env` fájlokban a környezet legyen `development` (pl. `NODE_ENV=development`, `MODE=development`).
- **Prod módhoz** állítsd át mindenhol `production`-ra (pl. `NODE_ENV=production`, `MODE=production`).

---

## Lokális tesztelés

A projekt kétféleképpen futtatható helyben:

### Dev mód (fejlesztői mód)

Ebben a módban a frontend és a backend külön szerveren fut, így gyorsabb a fejlesztés és a hibakeresés.

**Backend indítása:**
```bash
cd backend
npm install
npm run dev
```

**Frontend indítása:**
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