# This is essentially just a quick file to load Consider this the "Transform" and "Load" parts of the database.
# Pricing data for Namecheap and Hover were sourced from their webpages, both are publicly available when querying
# their API.


import os
import json
import logging
import psycopg2
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

database_url = os.environ.get("DATABASE_URL")
conn = psycopg2.connect(database_url)


# sb_url: str = os.environ.get("SUPABASE_URL")
# sb_key: str = os.environ.get("SUPABASE_KEY")
# print(sb_url, sb_key)
# supabase: Client = create_client(sb_url, sb_key)

def load_file(filename):
    with open(filename) as file:
        return json.load(file)


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)
registrars = ["hover", "namecheap"]
entries = []
query_sql = 'SELECT VERSION()'
cur = conn.cursor()
cur.execute(query_sql)


# Source of file: https://www.hover.com/domain-pricing
def process_hover():
    objfile = load_file("./data/hover.json")
    prices = objfile["prices"]
    for domain in prices:
        # For some reason, the 2nd entry is the registration price and the 3rd the renewal, 4th the transfer.
        # The other prices are basically used for markdowns.
        # The entries vary in size, but the first four entries are always there.
        entry = {"registrar": "hover", "tld": domain, "register": prices[domain][1], "renew": prices[domain][2]}
        logging.info(f'Inserting {domain} from registrar "hover"')
        cmd = """INSERT INTO tlds (registrar, tld, register, renew) VALUES ('{0}', '{1}', {2}, {3})""".format(
            entry["registrar"], entry["tld"], entry["register"], entry["renew"]
        )
        cur.execute(cmd)


# Source of file: https://www.namecheap.com/domains/tlds.ashx
def process_namecheap():
    objfile = load_file("./data/namecheap.json")
    for price_obj in objfile:
        tld = price_obj["Name"]
        pricing = price_obj["Pricing"]
        entry = {"registrar": "namecheap", "tld": tld, "register": pricing["Price"], "renew": pricing["Renewal"]}
        logging.info(f'Inserting {tld} from registrar "namecheap"')
        cmd = """INSERT INTO tlds (registrar, tld, register, renew) VALUES ('{0}', '{1}', {2}, {3})""".format(
            entry["registrar"], entry["tld"], entry["register"], entry["renew"]
        )
        cur.execute(cmd)


def main():
    # Uncomment the above lines if loading for the first time. Please make sure you're doing this correctly.

    # process_hover()
    # conn.commit()
    # process_namecheap()
    # conn.commit()
    pass


if __name__ == "__main__":
    main()
