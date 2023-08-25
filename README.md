```
// init db
npx prisma migrate dev --name init

// add field and migrate again
npx prisma migrate dev --name [nameofMigration]

// seed db
npx prisma db seed
```