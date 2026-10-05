import { Pool, types } from 'pg'

const OID_DATE = 1082

types.setTypeParser(OID_DATE, (valor) => valor)

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
