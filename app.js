import express from 'express'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  const utcDate = new Date(result.rows[0].now)

  const options = {
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  const formatter = new Intl.DateTimeFormat('uk-UA', options)
  const parts = formatter.formatToParts(utcDate)

  const day = parts.find(p => p.type === 'day')?.value
  const month = parts.find(p => p.type === 'month')?.value
  const year = parts.find(p => p.type === 'year')?.value
  const hour = parts.find(p => p.type === 'hour')?.value
  const minute = parts.find(p => p.type === 'minute')?.value
  const second = parts.find(p => p.type === 'second')?.value

  const formattedDate = `Привіт! Зараз ${day} ${month} ${year}, ${hour}:${minute}:${second}.`

  res.send(formattedDate)
})

app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`)
})
