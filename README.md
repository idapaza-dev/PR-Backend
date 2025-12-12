
katze/
└─ backend/
   ├─ src/
   │  ├─ config/            # conexión DB
   │  ├─ models/            # User, Cat, AdoptionRequest, SocialPost (opcional)
   │  ├─ middlewares/       # authJWT, requireRole
   │  ├─ controllers/       # auth, cats, adoptions, admin, ml, social
   │  ├─ services/          # mcpTools (autoTag, recommendCats)
   │  ├─ routes/            # index (declara todas)
   │  └─ server.js          # arranque express
   ├─ .env
   ├─ package.json
   └─ README.md
