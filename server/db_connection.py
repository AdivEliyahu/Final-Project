import pymongo 
import os 
from dotenv import load_dotenv

load_dotenv()

URI = os.getenv('DB_URI')

client = pymongo.MongoClient(URI)

db = client[os.getenv('DB_NAME')]

