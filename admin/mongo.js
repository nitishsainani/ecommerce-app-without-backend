import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient,
} from "mongodb-stitch-react-native-sdk";
import {getTable as getTableFromDb} from "../mongo/db";
import { APP_ID } from "../mongo/credentials";
import { CONSTANTS } from "../constants/database";
import {get} from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import {Alert} from "react-native";

////////TEST query

export const test = async () => {
  let categories = await getTable('categories');
  for(let i=0; i< categories.length; ++i) {
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      CONSTANTS.FACTORY_NAME
    );
    const db = mongoClient.db(CONSTANTS.DB_NAME);
    const itemsCollection = db.collection('items');
    const query = {"category": categories[i].title}
    const update = {"$set": {"category": categories[i]._id}};
    const options = {"upsert": false}

    itemsCollection.updateMany(query, update, options)
      .then(result => {
        const {matchedCount, modifiedCount} = result;
        console.log(result);
      })
      .catch(err => console.error(`Failed to update items: ${err}`))
  }

}
///////// DELETION Queries

export const deleteEntry = async (tableName, id) => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const itemsCollection = db.collection(tableName);

  const query = { "_id": id };

  return await itemsCollection.deleteOne(query)
    .then(result => {
      return true;
    })
    .catch(err => {
      return false;
    })
}


//////// UPDATING QUERIES

export const updateOptions = (options_) => {
  let options = Object.assign({}, options_);
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const itemsCollection = db.collection(CONSTANTS.TABLE.CONTENT_VALUES);
  const query = { "_id": options._id };
  delete options['_id'];
  const update = {
    "$set": options
  };
  const query_options = { "upsert": false };
  itemsCollection.updateOne(query, update, query_options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated the item.`)
      }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
};


export const getTable = async (table) => {
  return await getTableFromDb(table);
}

export const updateCategory = (category_) => {
  let category = Object.assign({}, category_);
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

export const updateCarousel = (item_to_update) => {
  let item = Object.assign({}, item_to_update);
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const itemsCollection = db.collection(CONSTANTS.TABLE.CAROUSEL);
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
}

export const updateProduct = (item_to_update) => {
  let item = Object.assign({}, item_to_update);
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
export const insertNewEntry = async (tableName, item) => {
  console.log(item);
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );

  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const itemsCollection = db.collection(tableName);

  return await itemsCollection.insertOne(item).then((res) => {
    return res.insertedId;
  }).catch((err) => {
    return false;
  });
}

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
