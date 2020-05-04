import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient,
} from "mongodb-stitch-react-native-sdk";

import { APP_ID } from "../mongo/credentials";
import { CONSTANTS } from "../constants/database";

////////TEST query

export const test = () => {
  console.log("TEST")
  console.log("TEST")
  console.log("TEST")
  console.log("TEST")

  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);

  const itemsCollection = db.collection(CONSTANTS.TABLE.ITEMS);
  const update = {
    "$set": {'in_stock': true}
  };
  const options = { "upsert": false }
  itemsCollection.updateMany({}, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      console.log(`Successfully matched ${matchedCount} and modified ${modifiedCount} items.`)
    })
    .catch(err => console.error(`Failed to update items: ${err}`))
}


//////// UPDATING QUERIES
export const updateCategory = (category) => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const itemsCollection = db.collection(CONSTANTS.TABLE.CATEGORIES);
  const query = { "_id": category._id };
  delete category['_id'];
  const update = {
    "$set": category
  };
  const options = { "upsert": false };
  itemsCollection.updateOne(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated the item.`)
      }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
};


export const updateProduct = (item) => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const itemsCollection = db.collection(CONSTANTS.TABLE.ITEMS);
  const query = { "_id": item._id };
  delete item['_id'];
  const update = {
    "$set": item
  };
  const options = { "upsert": false };
  itemsCollection.updateOne(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated the item.`)
      }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
};

/////// GETTING QUERIES

export const getPendingOrders = async () => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const itemsCollection = db.collection(CONSTANTS.TABLE.ITEMS);

  const options = {
    "sort": { "date": -1 },
  };
  itemsCollection.findOne(query, options)
    .then((result) => {
      if (result) {
        console.log(`Successfully found document: ${result}.`);
      } else {
        console.log('No document matches the provided query.');
      }
    })
    .catch((err) => console.error(`Failed to find document: ${err}`));



}

export const getAllProducts = async () => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(CONSTANTS.TABLE.ITEMS);
  return await tasks.find().asArray()
    .then((docs) => {
      return docs
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const getAllCategories = async () => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(CONSTANTS.TABLE.CATEGORIES);
  return await tasks.find().asArray()
    .then((docs) => {
      return docs
    })
    .catch((err) => {
      console.warn(err);
    });
};


///// INSERTION QUERIES
export const insertNewProduct = async (item) => {
  console.log("inserting data...");

  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(CONSTANTS.TABLE.ITEMS);

  tasks
    .insertOne(item)
    .then((res) => {
      console.log(`Successfully inserted item with _id: ${res.insertedId}`);
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const insertManyNewProduct = async (items) => {
  console.log("inserting data...");

  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(CONSTANTS.TABLE.ITEMS);

  tasks
    .insertMany(items)
    .then((res) => {
      console.log(`Successfully inserted all items: ${res.insertedId}`);
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const insertNewCategory = async (item) => {
  console.log("inserting...");

  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(CONSTANTS.TABLE.CATEGORIES);

  tasks
    .insertOne(item)
    .then((res) => {
      console.log(`Successfully inserted item with _id: ${res.insertedId}`);
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const insertManyNewCategory = async (items) => {
  console.log("inserting...");

  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(CONSTANTS.TABLE.CATEGORIES);

  tasks
    .insertMany(items)
    .then((res) => {
      console.log(`Successfully inserted all items`);
    })
    .catch((err) => {
      console.warn(err);
    });
};


/////////GET constants
export const getOptions = async () => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(CONSTANTS.TABLE.CONTENT_VALUES);
  let res = await tasks.find().asArray()
    .then((docs) => {
      return docs
    })
    .catch((err) => {
      console.warn(err);
    });
  return res[0];
}
