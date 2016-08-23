## To Run

Start Mongo: `mongod`

Frontend development:
```
gulp
```

app available on: http://localhost:3000

Backend development (if you have [nodemon](https://github.com/remy/nodemon) installed):
```
NODE_ENV=development nodemon index.js
```
Without Nodemon:
```
NODE_ENV=development node index.js
```

Production:
```
NODE_ENV=production node index.js
```