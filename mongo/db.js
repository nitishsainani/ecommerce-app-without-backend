import {AnonymousCredential, RemoteMongoClient, Stitch,} from "mongodb-stitch-react-native-sdk";

import {APP_ID} from "./credentials";
import {CONSTANTS} from "../constants/database";
import {test_categories, test_content_values, test_products} from './test_data'

///////////////////////////
/********************* */
const TESTING = false

/********************* */
///////////////////////////

export var data = {
  items: null,
  categories: null,
  content_values: null,
}

const _logIn = async () => {
  await Stitch.initializeDefaultAppClient(APP_ID).then((client) => {
    client
    client.auth
      .loginWithCredential(new AnonymousCredential())
      .then((user) => {
        USER_ID = user.id;
        USER_ID = client.auth.user.id;
        console.log(
          `Successfully logged in as user ${user.id}  ${client.auth.user.id}`
        );
      })
      .catch((err) => {
        console.log(`Failed to log in anonymously: ${err}`);
        USER_ID = undefined;
      });
  });
};

const _checkLogin = () => {
  if (USER_ID) {
    return true;
  } else {
    return false;
  }
};


/////// GETTING QUERIES
export const getTable = async (tableName) => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(tableName);
  return await tasks.find().asArray()
    .then((docs) => {
      return docs
    })
    .catch((err) => {
      console.warn(err);
    });
}

export const getAllProducts = async () => {
  if (TESTING) return test_products

  if (!_checkLogin()) {
    _logIn();
  }
  if (data.items == null) {
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      CONSTANTS.FACTORY_NAME
      );
      const db = mongoClient.db(CONSTANTS.DB_NAME);
      const tasks = db.collection(CONSTANTS.TABLE.ITEMS);
      const query = {};
      const options = {
        "sort": { "in_stock": -1, "show_priority": -1 },
      };
      data.items = await tasks.find(query, options).asArray()
      .then((docs) => {
        return docs
        for(let i=0; i<docs.length; ++i){
          console.log(docs[i]);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  }
      return data.items;
};

export const getAllCategories = async () => {
  if (TESTING) return test_categories
  if (!_checkLogin()) {
    await _logIn();
  }
  if (data.categories == null) {
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      CONSTANTS.FACTORY_NAME
    );
    const db = mongoClient.db(CONSTANTS.DB_NAME);
    const tasks = db.collection(CONSTANTS.TABLE.CATEGORIES);
    const query = {};
    const options = {
      "sort": { "in_stock": -1, "show_priority": -1 },
    };
    data.categories = await tasks.find(query, options).asArray()
        .then((docs) => {
          return docs
        })
        .catch((err) => {
          console.warn(err);
        });
  }
  return data.categories;
};


///// INSERTION QUERIES
export const insertOrder = async (order) => {

  console.log("inserting data...");

  if (!_checkLogin()) {
    await _logIn();
  }

  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    CONSTANTS.FACTORY_NAME
  );
  const db = mongoClient.db(CONSTANTS.DB_NAME);
  const tasks = db.collection(CONSTANTS.TABLE.ORDERS);

  return await tasks
    .insertOne(order)
    .then((res) => {
      console.log(`Successfully inserted item with _id: ${res.insertedId}`);
      return true;
    })
    .catch((err) => {
      console.warn(err);
      return false;
    });
}

export const insertNewProduct = async (item) => {
  console.log("inserting data...");

  if (!_checkLogin()) {
    await _logIn();
  }

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

  if (!_checkLogin()) {
    await _logIn();
  }

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

  if (!_checkLogin()) {
    await _logIn();
  }

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

  if (!_checkLogin()) {
    await _logIn();
  }

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

export const getMinOrderValue = async () => {
  if (TESTING) return test_content_values[0].min_order_value;

  if (!_checkLogin()) {
    _logIn();
  }

  if (data.content_values == null) {
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      CONSTANTS.FACTORY_NAME
    );
    const db = mongoClient.db(CONSTANTS.DB_NAME);
    const tasks = db.collection(CONSTANTS.TABLE.CONTENT_VALUES);
    data.content_values = await tasks.find().asArray()
    .then((docs) => {
      return docs
    })
    .catch((err) => {
      console.warn(err);
    });
  }
  return data.content_values[0].min_order_value;
}


const initialize = async () => {
  await _logIn();
  getAllCategories();
  getAllProducts();
}

if (!TESTING) {
  var USER_ID = undefined;
  var client = undefined;
  initialize();
}