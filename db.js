const spicedPg = require("spiced-pg");
const { hash, genSalt, compare } = require("bcryptjs");

const { DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;
const DATABASE_NAME = "socialnetwork";

const db = spicedPg(
    `postgres:${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

async function hashPassword(password) {
    const salt = await genSalt();
    return hash(password, salt);
}

// create User

async function createUser({ first_name, last_name, email, password }) {
    const hashedPassword = await hashPassword(password);
    const result = await db.query(
        `
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [first_name, last_name, email, hashedPassword]
    );
    return result.rows[0];
}

// GET USER BY EMAIL

async function getUserByEmail(email) {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
        email,
    ]);
    return result.rows[0];
}

// LOGIN

async function login({ email, password }) {
    const foundUser = await getUserByEmail(email);
    // console.log("user", foundUser);
    if (!foundUser) {
        return null;
    }
    const match = await compare(password, foundUser.password_hash);
    // console.log("match", match);
    if (!match) {
        return null;
    }
    return foundUser;
}

//current User

async function getUserById(id) {
    const result = await db.query(
        `
    SELECT * FROM users WHERE id = $1
    `,
        [id]
    );
    return result.rows[0];
}

//UPDATE USER IMG

async function updateAvatar({ img, id }) {
    const result = await db.query(
        `
    UPDATE users
    SET img_url = $1
    WHERE id = $2
    RETURNING img_url
    `,
        [img, id]
    );
    return result.rows[0];
}
//Update BIO
async function updateBio({ bio, id }) {
    const result = await db.query(
        `
    UPDATE users
    SET bio = $1
    WHERE id = $2
    RETURNING bio
    `,
        [bio, id]
    );
    return result.rows[0];
}
// GET LAST 4 USERS
async function lastNewUsers() {
    const result = await db.query(
        `
        SELECT * FROM users
        ORDER BY id
        DESC LIMIT 4
        `
    );
    return result.rows;
}

// SEARCH USER
async function searchUsers(val) {
    const result = await db.query(
        `
        SELECT id, first_name, last_name, img_url
        FROM users
        WHERE first_name || last_name
        ILIKE $1
        `,
        ["%" + val + "%"]
    );
    return result.rows;
}
//

// CHECK FRIENDSHIP
async function getFriendship(sender_id, recipient_id) {
    const result = await db.query(
        `
        SELECT sender_id, recipient_id, accepted FROM friendships
        WHERE sender_id = $1 AND recipient_id = $2
        OR    sender_id = $2 AND recipient_id = $1
    `,
        [sender_id, +recipient_id]
    );
    return result.rows[0];
}

// INSERT FRIENDSHIP REQUEST
async function requestFriendship({ sender_id, recipient_id }) {
    const result = await db.query(
        `
    INSERT INTO friendships(sender_id, recipient_id)
    VALUES ($1,$2)
    `,
        [sender_id, recipient_id]
    );
    return result.rows[0];
}

// UPDATE FRIENDSHIP REQUEST
async function acceptFriendship({ sender_id, recipient_id }) {
    const result = await db.query(
        `
    UPDATE friendships 
    SET accepted = true
    WHERE sender_id = $1 
    AND recipient_id = $2
    RETURNING *`,
        [sender_id, recipient_id]
    );
    return result.rows[0];
}

// DELETE FRIENDSHIP
async function deleteFriendship({ sender_id, recipient_id }) {
    const result = await db.query(
        `
    DELETE FROM friendships
    WHERE sender_id = $1 AND recipient_id = $2
    OR  sender_id = $2 AND recipient_id = $1
    `,
        [sender_id, recipient_id]
    );
    return result.rows[0];
}

// GET FRIENDSHIPS

async function getFriendships(user_id) {
    const result = await db.query(
        `
        SELECT friendships.accepted,
        friendships.sender_id,
        friendships.recipient_id,
        users.id AS user_id,
        users.first_name, users.last_name, users.img_url
        FROM friendships JOIN users
        ON (users.id = friendships.sender_id AND friendships.recipient_id = $1)
        OR (users.id = friendships.recipient_id AND friendships.sender_id = $1 AND accepted = true)
    `,
        [user_id]
    );
    return result.rows;
}

async function getChatMessages() {
    const result = await db.query(`
        SELECT chat.id, chat.sender_id, chat.message, chat.created_at,
        users.first_name, users.last_name, users.img_url
        FROM chat JOIN users
        ON (users.id = chat.sender_id)
    `);
    return result.rows;
}

async function setChatMessages({ sender_id, message }) {
    const result = await db.query(
        `
    INSERT INTO chat(sender_id, message)
    VALUES ($1,$2)
    RETURNING id, created_at
    `,
        [sender_id, message]
    );
    return result.rows[0];
}

module.exports = {
    createUser,
    login,
    getUserById,
    updateAvatar,
    updateBio,
    searchUsers,
    lastNewUsers,
    getFriendship,
    requestFriendship,
    acceptFriendship,
    deleteFriendship,
    getFriendships,
    getChatMessages,
    setChatMessages,
};
