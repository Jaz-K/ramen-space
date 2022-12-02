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
// GET LAST 3 USERS
async function lastThreeUsers() {
    const result = await db.query(
        `
        SELECT * FROM users
        ORDER BY id
        DESC LIMIT 3
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
        WHERE first_name
        ILIKE $1
        `,
        ["%" + val + "%"]
    );
    return result.rows;
}
//

module.exports = {
    createUser,
    login,
    getUserById,
    updateAvatar,
    updateBio,
    searchUsers,
    lastThreeUsers,
};
