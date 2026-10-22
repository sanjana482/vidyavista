import csv
import os
import requests
import psycopg
from pathlib import Path

# --- APNI POSTGRESQL DATABASE DETAILS DAALEIN ---
DB_HOST = "localhost"
DB_NAME = "your_database_name"
DB_USER = "postgres"
DB_PASS = "your_password"
DB_PORT = "5432"

# 1. PostgreSQL Database Connection
try:
    conn = psycopg.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT
    )
    cursor = conn.cursor()
    print("Database connected successfully!")
except Exception as e:
    print(f"Connection failed: {e}")
    exit()

# 2. Image Folder Setup
base_dir = Path("schools_images")
base_dir.mkdir(exist_ok=True)

csv_file_path = "vidyavista_100_schools.csv"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

# 3. Read CSV and Process
with open(csv_file_path, mode="r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    
    count = 0
    for row in reader:
        school_name = row["name"]
        city = row["city"]
        
        # Create Folder Name: SchoolName_City
        safe_name = "".join(c for c in school_name if c.isalnum() or c in (' ', '_', '-')).strip()
        folder_name = f"{safe_name}_{city}"
        school_folder = base_dir / folder_name
        school_folder.mkdir(parents=True, exist_ok=True)
        
        # Download Image into School Folder
        img_url = row["image"]
        if img_url:
            try:
                res = requests.get(img_url, headers=headers, timeout=10)
                if res.status_code == 200:
                    with open(school_folder / "cover.jpg", "wb") as img_file:
                        img_file.write(res.content)
            except Exception as e:
                pass

        # Insert Query into PostgreSQL
        insert_query = """
        INSERT INTO schools (
            name, area, city, state, board, grades, type, gender,
            fee, rating, reviews, photos, phone, image, facilities,
            top_rated, is_active
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        );
        """
        
        cursor.execute(insert_query, (
            row["name"], row["area"], row["city"], row["state"],
            row["board"], row["grades"], row["type"], row["gender"],
            float(row["fee"]), float(row["rating"]), int(row["reviews"]),
            int(row["photos"]), row["phone"], row["image"], row["facilities"],
            row["top_rated"].lower() in ['yes', 'true', '1'],
            row["is_active"].lower() in ['yes', 'true', '1']
        ))
        count += 1

# Save & Close
conn.commit()
cursor.close()
conn.close()

print(f"Successfully inserted {count} schools into PostgreSQL & organized image folders!")