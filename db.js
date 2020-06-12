const pgp = require('pg-promise')(/* options */);

class DB {
    constructor(host, port, database, user, password) {
        const cn = {
            host: host,
            port: port,
            database: database,
            user: user,
            password: password,
            max: 30 // use up to 30 connections
        };
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
        return this._db.query(query, params);
    }

    getMessages(currentUser, timestamp) {
        let query =
            "SELECT cm.user_from, cm.user_to, cm.text, timestamp, c2.img as img_URL " +
            "FROM c_user c1 " +
            "INNER JOIN c_message cm on ${current_username} = cm.user_from " +
            "INNER JOIN c_user c2 on c2.username = cm.user_to " +
            "WHERE cm.timestamp > ${timestamp} " +
            "UNION " +
            "SELECT cm.user_from, cm.user_to, cm.text, timestamp, c2.img as img_URL " +
            "FROM c_user c1 " +
            "INNER JOIN c_message cm ON ${current_username} = cm.user_to " +
            "INNER JOIN c_user c2 ON c2.username = cm.user_from " +
            "WHERE cm.timestamp > ${timestamp}";

        const params = {
            current_username: currentUser.username,
            timestamp: timestamp - 5000
        };
        return this._db.query(query, params);
    }

    insertMessage(from, to, timestamp, text) {
        const query = "INSERT INTO c_message (user_from, user_to, timestamp, text) VALUES (${from_id}, ${to_id}, ${timestamp}, ${text})";
        const params = {
            from_id: from.username,
            to_id: to.username,
            timestamp: timestamp,
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

    listUserWithoutChat(user, usernameQuery) {
        let query = "SELECT DISTINCT(c_user.username), c_user.img " +
            "FROM c_user " +
            "WHERE c_user.username NOT IN ( " +
            "    SELECT m1.user_to " +
            "    FROM c_message AS m1 " +
            "    WHERE m1.user_from = ${username} " +
            "    UNION " +
            "    SELECT m1.user_from " +
            "    FROM c_message AS m1 " +
            "    WHERE m1.user_to = ${username} " +
            "    UNION " +
            "    SELECT ${username} )" +
            "AND c_user.username LIKE ${usernameQuery}";
        const params = {
            username: user.username,
            usernameQuery: usernameQuery + "%"
        };
        return this._db.query(query, params);
    }

}

//
const db = new DB("localhost", "5432", "node_chat", "valerio", "postgress");
module.exports = db;
