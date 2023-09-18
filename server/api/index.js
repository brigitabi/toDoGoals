const express = require('express');
const pool = require('../db');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("App working")
})

app.get('/todos/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    console.log(userEmail)
    try { 
        const todos = await pool.query('SELECT * FROM todoss WHERE user_email = $1', [userEmail])
        res.json(todos.rows)
    } catch (err) { 
        console.error(err)
    }
})

// create a new todo
app.post('/todos', async(req, res) => { 
    const {user_email, title, progress, date} = req.body
    const id = uuidv4()
    try { 
        const newToDo = await pool.query(`INSERT INTO todoss(id, user_email, title, progress, date) VALUES($1,$2,$3,$4,$5)`, 
        [id, user_email, title, progress, date])
        res.json(newToDo)
    } catch (err) {
        console.error(err)
    }
})

// edititing
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { user_email, title, progress, date} = req.body 
    try { 
        const editToDo = await pool.query('UPDATE todoss SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;', [user_email, title, progress, date, id])
        res.json(editToDo)
    } catch (err) { 
        console.error(err)
    }
})

// deleting a goal

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteToDo = await pool.query('DELETE FROM todoss WHERE id = $1;', [id])
        res.json(deleteToDo)
    } catch (err) { 
        console.error(err)
    }
})

//signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    try {
        const signUp = await pool.query(`INSERT INTO userss (email, hashed_password) VALUES($1, $2)`, 
    [email, hashedPassword])

    console.log("signup", signUp)

        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

        res.json({ email, token })

    } catch (err) { 
        console.error(err)
        if (err) {
            res.json({ detail: err.detail })
        }
    }
})

//login
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const users = await pool.query('SELECT * FROM userss WHERE email = $1', [email])

        if (!users.rows.length) return res.json({ detail : 'User does not exist'})

        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

        if (success) { 
            res.json({ 'email' : users.rows[0].email, token})
        } else {
            res.json({ detail: "Login failed"})
        }
    } catch (err) { 
        console.error(err)
    }
})

module.exports = app;