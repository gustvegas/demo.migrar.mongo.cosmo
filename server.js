import fs from 'fs';
import express from 'express';
import Schema from './data/schema';
import GraphQLHTTP from 'express-graphql';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';

import {MongoClient} from 'mongodb';

let app = express();
app.use(express.static('public'));

(async () => {
  try {
    //let db = await MongoClient.connect('mongodb://localhost/Links');
    let db = await MongoClient.connect('mongodb://democosmolinks:pmSr9WLwYjKiVjwYtyGYL40pxaGjMmK71suNb8s9BIc2OgQBix8FG4o5kbIAuXlY4AOBAEQgDs3mS5BZDAS35A==@democosmolinks.documents.azure.com:10255/?ssl=true');
    let schema = Schema(db);

    app.use('/graphql', GraphQLHTTP({
      schema,
      graphiql: true
    }));

    let server = app.listen(process.env.PORT || 3000, () => {
      console.log(`Listening on port ${server.address().port}`);
    });

    // Generate schema.json
    let json = await graphql(schema, introspectionQuery);
    fs.writeFile('./data/schema.json', JSON.stringify(json, null, 2), (err) => {
      if (err) throw err;

      console.log('JSON schema created');
    });
  } catch(e) {
    console.log(e);
  }
})();
