import fs from 'fs'
import path from 'path'
import {pool} from './db.js'
import {hash} from 'bcrypt'
import jwt from 'jsonwebtoken';
const {sign} = jwt

const __dirname = import.meta.dirname

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname,"../initialData.sql"), "utf8");
    pool.query(sql)
}

/*
const insertTestUser = (email,password) => {
    hash (password,10,(error,hashedPassword) => {
        pool.query('insert into account (email,password) values ($1,$2)',
            [email,hashedPassword])
    })
}
*/
const insertTestUser = (email, password) => {
    return new Promise((resolve, reject) => {
        hash(password, 10, (error, hashedPassword) => {
            if (error) return reject(error);

            pool.query(
                'INSERT INTO account (email, password) VALUES ($1, $2)',
                [email, hashedPassword],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    });
};

const getToken = (email) => {
    return sign({user:email},process.env.JWT_SECRET_KEY)
}

export {initializeTestDb,insertTestUser,getToken}
