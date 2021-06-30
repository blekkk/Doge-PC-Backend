# Computer parts backend API for e-commerce

Using NodeJS + express + mongodb + JWT

## Getting started

first, the tool(s) that you **MUST** have:
- NodeJS (version 14 and above)
- MongoDB

second, install the dependencies:
```bash
npm install
```

third, create an .env file for env variables within the root directories with these variables:
- DATABASE_URI (for your MongoDB uri string)
- PORT
- ORIGIN (used if you have a frontend site, (use `http://localhost:8000` if don't have any))
- TOKEN_SECRET (whatever you want, used in JWT)

fourth, run the server:
```bash
npm run dev
```
