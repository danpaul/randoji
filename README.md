## To Run

Start MySQL

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

## Global Events

geo-lit-place-click [_id: place id]
    Triggered when user cicks on place.

## Todo

* Update map:
  * add marker for self
  * use round markers with green for viewable red for non-viewable
  * add zoom functionality
  * add radius for viewable area
  * remove default UI and add zoom
* Update comments
  * date formatting
  * comment ranking?
* User management
  * confirm user is logged in after registering
  * add password resets

update:
    /node_modules/sql_login_middleware/index.js
    /frontend_app/app/lib/geo_lit.js

user auth:
    /node_modules/sql_comments_middleware/index.js

/node_modules/sql_comments_middleware/node_modules/sql_comment/models/comment.js
/node_modules/sql_comments_middleware/node_modules/sql_comment/index.js
/node_modules/sql_comments_middleware/node_modules/sql_comment/index.js
/node_modules/sql_comments_middleware/index.js

???
sync /node_modules/sql_login_middleware/index.js with repo
sync /node_modules/sql_comments_middleware with repo

## Notes

resize map marker: http://stackoverflow.com/questions/3942573/use-an-svg-for-a-marker-in-google-maps

address already in use: pkill node

custom style map marker

https://developers.google.com/maps/documentation/javascript/symbols

adjust zoom: http://stackoverflow.com/questions/5701055/google-maps-v3-adjust-zoom-level-after-map-has-been-initialised