const pgp = require('pg-promise')(/* options */);

// db.connect()
//     .then(value => console.log("OK"))
//     .catch(reason => console.log("NO"))


class DB {
    constructor(host, port, database, user, password) {
        const cn = {
            host: host,
            port: port,
            database: database,
            user: user,
            password: password,
            max: 30 // use up to 30 connections
        }
        this._db = pgp(cn)
    }

    getUser(user) {
        let query = "SELECT * FROM c_user WHERE 1=1";
        const params = {};
        if (user.username !== null && user.username !== undefined) {
            query += " AND username=${username}";
            params['username'] = user.username
        }
        if (user.password !== null && user.password !== undefined) {
            query += " AND password=${password}";
            params['password'] = user.password
        }
        console.log(query, params);
        return this._db.query(query, params);
    }

    getMessages(currentUser, timestamp) {
        let query =
            "SELECT cm.user_from, cm.user_to, cm.text, trunc(EXTRACT(epoch FROM cm.timestamp)) * 1000 as timestamp, c2.img as img_URL " +
            "FROM c_user c1 " +
            "INNER JOIN c_message cm on ${current_username} = cm.user_from " +
            "INNER JOIN c_user c2 on c2.username = cm.user_to " +
            "WHERE cm.timestamp > to_timestamp(${timestamp}) " +
            "UNION " +
            "SELECT cm.user_from, cm.user_to, cm.text, trunc(EXTRACT(epoch FROM cm.timestamp)) * 1000 as timestamp, c2.img as img_URL " +
            "FROM c_user c1 " +
            "INNER JOIN c_message cm ON ${current_username} = cm.user_to " +
            "INNER JOIN c_user c2 ON c2.username = cm.user_from " +
            "WHERE cm.timestamp > to_timestamp(${timestamp})";

        console.log(query);
        const params = {
            current_username: currentUser.username,
            timestamp: timestamp / 1000
        };
        return this._db.query(query, params);
    }

    insertMessage(from, to, timestamp, text) {
        const query = "INSERT INTO c_message (user_from, user_to, timestamp, text) VALUES (${from_id}, ${to_id}, to_timestamp(${timestamp}), ${text})";
        const params = {
            from_id: from.username,
            to_id: to.username,
            timestamp: timestamp / 1000,
            text: text
        };
        return this._db.query(query, params);
    }


    insertUser(user) {
        const query = "INSERT INTO c_user (username, password, img) VALUES (${username}, ${password}, ${user_img})";
        const params = {
            username: user.username,
            password: user.password,
            user_img: user.imgURL,
        };
        return this._db.query(query, params)
    }

}

//
const db = new DB("localhost", "5432", "node_chat", "valerio", "postgress");
module.exports = db;

//
// const user1 = new User(null, "vale1", "https://vignette.wikia.nocookie.net/onepiece/images/0/0a/Whitebeard_Jumputi.png/revision/latest?cb=20190927232401", "prova")
// const user2 = new User(null, "vale2", "https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_11-512.png", "prova")
// const user1Tmp = new User(null, "vale1", "prova");
// const user2Tmp = new User(null, "vale2", "prova");
// // db.insertUser(user1);
// // db.insertUser(user2);
//
// Promise.all([db.getUser(user1Tmp), db.getUser(user2Tmp)])
//     .then(value => {
//         const user1Data = value[0][0]
//         const user2Data = value[1][0]
//         const user1 = new User(user1Data["user_id"], user1Data["user_username"], user1Data["user_img"])
//         const user2 = new User(user2Data["user_id"], user2Data["user_username"], user2Data["user_img"])
//         return [user1, user2]
//     })
//     .then(users => {
//         return db.insertMessage(users[0], users[1], 1234, "ciaooo")
//             .then(r => {
//                 return users
//             })
//     })
//     .then(function (users) {
//         return db.getMessages(users[0], users[1])
//     })
//     // .then(result => {
//     //     console.log("Result: ", result)
//     // })
//     .catch(console.log)

// db.insertMessage(user1, user2, 1234, "ciaooo");
// db.selectUser(user_id)
//     .then(value => console.log(value));
//     .then(function (data) {
//         console.log('DATA:', data.value)
//     })
//     .catch(function (error) {
//         console.log('ERROR:', error)
//     })


