"""
fetch_laptimes.py
Fetch lap time data using fastf1 and save to MongoDB collection 'lap_times'.
Each document contains: year, grandPrix, session, driver, driver_code,
lapNumber, lapTime_seconds, lapTime_hms, lapStartTime, tyreCompound, createdAt
"""

import os
from datetime import datetime
import fastf1
import pymongo
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "f1db")

# Configure your target session here or via .env
YEAR = int(os.getenv("YEAR", "2025"))
GRAND_PRIX = os.getenv("GRAND_PRIX", "las_vegas")
SESSION = os.getenv("SESSION", "R")  # R, Q, FP1, etc.

# FastF1 cache - speeds up subsequent runs
#fastf1.Cache.enable_cache("cache")

def to_seconds(td):
    """Convert pandas Timedelta to float seconds (or None)."""
    try:
        if td is None:
            return None
        return float(td.total_seconds())
    except Exception:
        return None

def main():
    print(f"Connecting to MongoDB: {MONGO_URI}  DB: {DB_NAME}")
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    col = db["lap_times"]

    # Create a unique index to avoid duplicate inserts (year+gp+session+driver+lapNumber)
    try:
        col.create_index(
            [("year", pymongo.ASCENDING),
             ("grandPrix", pymongo.ASCENDING),
             ("session", pymongo.ASCENDING),
             ("driver_code", pymongo.ASCENDING),
             ("lapNumber", pymongo.ASCENDING)],
            unique=True,
            background=True,
            name="unique_lap_idx"
        )
    except Exception as e:
        print("Index creation error (may already exist):", e)

    print(f"Loading FastF1 session: {YEAR} {GRAND_PRIX} {SESSION}")
    session = fastf1.get_session(YEAR, GRAND_PRIX, SESSION)
    session.load()  # downloads and caches session data
    laps = session.laps

    if laps.empty:
        print("No laps found for this session. Confirm YEAR/GRAND_PRIX/SESSION.")
        return

    docs_to_insert = []
    for idx, lap in laps.iterlaps():
        # lap is a pandas Series-like object
        driver_code = lap.get('Driver', None) or lap.get('DriverNumber', None)
        driver_code = str(driver_code)

        lap_time_td = lap.get('LapTime', None)  # pandas Timedelta
        lap_time_seconds = to_seconds(lap_time_td)
        lap_time_hms = None
        if lap_time_td is not None:
            lap_time_hms = str(lap_time_td)

        doc = {
            "year": YEAR,
            "grandPrix": GRAND_PRIX,
            "session": SESSION,
            "driver": lap.get('Driver', lap.get('DriverNumber', None)),
            "driver_code": driver_code,
            "lapNumber": int(lap.get('LapNumber')) if lap.get('LapNumber') is not None else None,
            "lapTime_seconds": lap_time_seconds,
            "lapTime_hms": lap_time_hms,
            "lapStartTime": str(lap.get('LapStartTime')) if lap.get('LapStartTime') is not None else None,
            "compound": lap.get('Compound', None),
            "is_fastest": bool(lap.get('IsPersonalBest', False)),
            "createdAt": datetime.utcnow()
        }

        docs_to_insert.append(doc)

    if docs_to_insert:
        # Insert with ordered=False so independent inserts continue if duplicates occur
        try:
            result = col.insert_many(docs_to_insert, ordered=False)
            print(f"Inserted {len(result.inserted_ids)} lap documents.")
        except pymongo.errors.BulkWriteError as bwe:
            # Some inserts may be duplicates (skipped because of unique index)
            inserted = sum(1 for op in bwe.details.get('writeErrors', []) if op.get('code') != 11000)
            print("Bulk write error (duplicates likely). Details:", bwe.details)
            # Fallback: try individual upsert to ensure freshness
            for d in docs_to_insert:
                try:
                    col.update_one(
                        {"year": d["year"], "grandPrix": d["grandPrix"], "session": d["session"],
                         "driver_code": d["driver_code"], "lapNumber": d["lapNumber"]},
                        {"$set": d}, upsert=True
                    )
                except Exception as e:
                    print("Upsert failed:", e)
            print("Finished upsert fallback.")
        except Exception as e:
            print("Insert_many failed:", e)
    else:
        print("No lap documents to insert.")

    print("Done.")

if __name__ == "__main__":
    main()
