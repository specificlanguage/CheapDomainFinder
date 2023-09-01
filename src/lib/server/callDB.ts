import { Client } from "pg";
import { DATABASE_URL } from "$env/static/private";
import * as fs from "fs";

const client = new Client(
  {connectionString: DATABASE_URL, ssl: {rejectUnauthorized: true}})
await client.connect();

interface ResultRow {
  registrar: string,
  renew: number,
  register: number,
  tld: string
}

/**
 * Queries the database for the given registrar and tld.
 * @param registrar - 'namecheap' and 'hover' are the only ones supported right now.
 * @param tld - A top level domain (without the leading dot, although TLDs such as 'co.uk' are allowed.)
 */
export async function queryForTLD(registrar: string, tld: string): Promise<ResultRow | null> {
  try {
    const q = 'SELECT * FROM tlds WHERE registrar = $1 AND tld = $2'
    const vals = [registrar, tld]
    const res = await client.query(q, vals);
    return res.rows[0]
  } catch (e) {
    return null;
  }
}

