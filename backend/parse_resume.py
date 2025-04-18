import sys
import json
from pyresparser import ResumeParser

def parse_resume(file_path):
    try:
        data = ResumeParser(file_path).get_extracted_data()
        print(json.dumps(data))  # Output as JSON
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    file_path = sys.argv[1]  # Get the file path from the command line
    parse_resume(file_path)
