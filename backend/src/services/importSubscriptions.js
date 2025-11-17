const fs = require('fs')
const path = require('path')
const readline = require('readline')
const knexConfig = require('../../knexfile')
const env = process.env.NODE_ENV || 'development'
const knex = require('knex')(knexConfig[env])

async function parseCSVLine(line) {
  // Basic CSV split by comma, naive but OK for simple files
  // Expect headers: user_email,plan,amount,currency,status,started_at,renewed_at
  const parts = line.split(',')
  return {
    user_email: parts[0] && parts[0].trim(),
    plan: parts[1] && parts[1].trim(),
    amount: parts[2] && parts[2].trim(),
    currency: parts[3] && parts[3].trim(),
    status: parts[4] && parts[4].trim(),
    started_at: parts[5] && parts[5].trim(),
    renewed_at: parts[6] && parts[6].trim(),
    raw: parts
  }
}

async function findUserIdByEmail(email) {
  if (!email) return null
  const user = await knex('users').where('email', email).first()
  return user ? user.id : null
}

async function importFile(filePath) {
  const abs = path.resolve(filePath)
  if (!fs.existsSync(abs)) throw new Error('File not found: ' + abs)

  const rl = readline.createInterface({
    input: fs.createReadStream(abs),
    crlfDelay: Infinity
  })

  let lineNo = 0
  let headers = []
  let inserted = 0
  for await (const line of rl) {
    lineNo++
    if (!line.trim()) continue
    if (lineNo === 1) {
      headers = line.split(',').map(h => h.trim())
      continue
    }
    const row = await parseCSVLine(line)
    const user_id = await findUserIdByEmail(row.user_email)
    const amount_cents = row.amount ? Math.round(parseFloat(row.amount) * 100) : null

    const payload = {
      user_id,
      plan: row.plan || 'unknown',
      amount_cents,
      currency: row.currency || null,
      status: row.status || null,
      started_at: row.started_at ? new Date(row.started_at) : null,
      renewed_at: row.renewed_at ? new Date(row.renewed_at) : null,
      raw_data: JSON.stringify({ headers, raw: row.raw }),
    }

    await knex('subscriptions').insert(payload)
    inserted++
  }

  return { inserted }
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '..', '..', 'data', 'subscriptions.csv')
  importFile(file).then(res => {
    console.log('Import complete:', res)
    process.exit(0)
  }).catch(err => {
    console.error('Import failed:', err)
    process.exit(1)
  })
}

module.exports = { importFile }
