# This is essentially just a quick file to load pricing data for Namecheap and Hover were sourced from their webpages,
# both are publicly available when querying their websites without an API key and
# are available by looking at network calls.
# Consider this the "Transform" and "Load" parts of the database.
# their API.

import csv
import json
import logging
import os

import psycopg2
import roman
from dotenv import load_dotenv

load_dotenv()

database_url = os.environ.get("DATABASE_URL")
conn = psycopg2.connect(database_url)


def load_file(filename):
    with open(filename) as file:
        return json.load(file)


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)
registrars = ["hover", "namecheap"]
entries = []
query_sql = 'SELECT VERSION()'
cur = conn.cursor()
cur.execute(query_sql)


def create_table():
    cur.execute("""create table
      public.tlds (
        id bigint generated by default as identity,
        registrar character varying null,
        tld character varying null,
        register real null,
        renew real null,
        constraint tlds_pkey primary key (id)
      ) tablespace pg_default;""")


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
    conn.commit()


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
    conn.commit()


# Source of file: https://www.squarespace.com/api/domain-tld-categories/all/tlds
def process_squarespace():
    objfile = load_file("./data/squarespace.json")
    for result in objfile["results"]:
        tld = result["tld"]
        level = result["level"]
        price = 20

        # The squarespace model is pretty easy to understand, just parse the roman numeral at the end of the level
        # (because it's usually premium) and it works! This could have been done by parsing the Roman Numerals by
        # itself, but there's only 6 levels, so it's just easier to do manually than to copy a LeetCode solution.
        markups = [20, 30, 40, 50, 60, 70, 100, 125, 250, 350, ]
        if level != "basic":
            l = level[8:]  # First eight characters of a premium string are always "premium_"
            # print(l)
            l = l.upper()
            num = roman.fromRoman(l)
            price = markups[num]
        logging.info(f'Inserting {tld} from registrar "squarespace"')
        cmd = f"""INSERT INTO tlds (registrar, tld, register, renew) VALUES ('squarespace', '{tld}', {price}, {price})"""
        cur.execute(cmd)
    conn.commit()


# Source of file(s):
# https://github.com/rizdaprasetya/Raw-Domain-Extension-Price/blob/master/scrap-cloudflare-domain-pricing/scripts/dump-cloudflare-domain-pricing.js
# https://dash.cloudflare.com/<account token here>/domains/tlds -- above repository was missing some TLDs.
def process_cloudflare():
    with open("./data/cloudflare.csv") as cloudflare_csv:
        reader = csv.DictReader(cloudflare_csv)
        for row in reader:
            tld = row["tld_name"]
            renew = row["renewal_price_usd"]
            register = row["registration_price_usd"]
            logging.info(f'Inserting {tld} from registrar "cloudflare"')
            cmd = f"""INSERT INTO tlds (registrar, tld, register, renew) VALUES ('cloudflare', '{tld}', {register}, {renew})"""
            cur.execute(cmd)
        conn.commit()

def main():
    # Uncomment the below lines if loading for the first time. Please make sure you're doing this correctly.
    # create_table()
    # process_hover()
    # process_namecheap()
    # process_squarespace()
    # process_cloudflare()
    pass


if __name__ == "__main__":
    main()
