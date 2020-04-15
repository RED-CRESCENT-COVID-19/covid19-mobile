import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");

export const getHouse = () => {
  return new Promise(
    (resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from house;`,
          null,
          (_, { rows: { _array } }) => {
            resolve(_array);
          }
        );
      });
    },
    null,
    null
  );
};
export const getUser = () => {
  return new Promise(
    (resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from user;`,
          null,
          (_, { rows: { _array } }) => {
            resolve(_array);
          }
        );
      });
    },
    null,
    null
  );
};
export const addHouse = (params, token) => {
  const { address, id, lat, lng, is_contacted } = params;
  return new Promise(resolve => {
    db.transaction(
      tx => {
        tx.executeSql(
          "insert into house (id,token, address,lat,lng,is_contacted,createdAt) values (?, ?, ?, ?, ?, ?,?)",
          [id, token, address, lat, lng, is_contacted, new Date().toISOString()]
        );
      },
      error => {
        console.log("db add house error", error);
      },
      () => resolve(id)
    );
  });
};

export const deleteHouse = (houseId, token) => {
  return new Promise(resolve => {
    db.transaction(
      tx => {
        // const query = `begin;
        // 	DELETE FROM house where id = '${houseId}';
        // 	DELETE FROM user where house_id = '${houseId}';
        // 	commit;
        // 	`;
        tx.executeSql(
          `DELETE FROM house where id = '${houseId}'`,
          null,
          (_, { rows: { _array } }) => resolve(_array)
        );
      },
      error => console.log("delete house error is ", error)
    );
  });
};

export const getUsersForHouseId = houseId => {
  return new Promise(resolve => {
    db.transaction(
      tx => {
        tx.executeSql(
          `select * from user where house_id = '${houseId}'`,
          null,
          (_, { rows: { _array } }) => resolve(_array)
        );
      },
      error => console.log("getUsersForHouseId error is ", error)
    );
  });
};

export const addPerson = (params, token) => {
  return new Promise(
    resolve => {
      db.transaction(
        tx => {
          tx.executeSql(
            `insert into user 
        (id,token, house_id, unique_id, cnic, gender, phone, age, temprature, unit, fever, cough, sputum, fatigue, sob, headache, congestion,
          meralgia, hemoptysis, conjuctivitis, notes,created_at, updated_at) 
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
            [
              params.id,
              token,
              params.houseID,
              params.uniqueID,
              params.cnic,
              params.gender,
              params.phone,
              params.age,
              params.temperature,
              params.unit,
              params.fever,
              params.cough,
              params.sputum,
              params.fatigue,
              params.sob,
              params.headache,
              params.congestion,
              params.meralgia,
              params.hemoptysis,
              params.conjuctivitis,
              params.notes,
              new Date().toISOString(),
              new Date().toISOString()
            ]
          );
        },
        b =>
          resolve({
            success: true
          })
      );
    },
    null,
    null
  );
};

export const wipeDatabase = () => {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        `DROP TABLE house;
      `
      );
    });
    db.transaction(
      tx => {
        tx.executeSql(
          `DROP table user;
      `
        );
      },
      null,
      () => resolve()
    );
  });
};

export const initializeDatabase = () => {
  return new Promise(
    resolve => {
      db.transaction(
        tx => {
          tx.executeSql(`create table if not exists house
      (id text primary key not null,token text, address text not null, lat float, lng float, is_contacted integer,createdAt);
      
      `);
          tx.executeSql(`create table if not exists user
      (id text primary key not null, token text, house_id, unique_id,cnic, gender, phone, age, temprature, unit, fever,
      cough, sputum, fatigue, sob, headache, congestion, meralgia, hemoptysis, conjuctivitis, notes,created_at, updated_at);`);
        },
        () => {},
        () => resolve()
      );
    },
    null,
    null
  );
};
