# DateMetrik
Nuxt project that allows you to enter basic preferences on potential dating partners and get the percentage of the german population that match your criteria.

## Development
```bash
# install project
npm install

# start development server
npm run dev

# build application for prod
npm run build

# preview prod build
npm run preview
```

### Todo
- [x] FAQ Pages explaining the logic
- [x] Source Page to cite all sources
- [x] Move from sqlite3 to Postgres, as no Provider supports sqlite3 well enough
- [ ] Set up vercel postgres db for local development
- [ ] Refactor percentage.ts. bad TS, bad everything. not DRY
- [ ] Use german labels for weight