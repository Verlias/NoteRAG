import os
import json
from pypdf import PdfReader

# Task 1:
# Create a program that can extract at least TXT and PDF files and convert it to raw text
# Clean Text - Remove headers and footers, remove page numbers
# Store extract text locally (file system or database)
# Save basic metadata - Document name, page number (for PDFs)
# Verify correctness by printing clean text to the console
# /Users/zachwang/projectDocument/pdftest.pdf
# /Users/zachwang/projectDocument/txttest.txt

output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

# Clean 
def clean_text(raw):
    if not raw:
        return ""
    
    cleaned = raw.replace("\n", " ")
    cleaned = " ".join(cleaned.split())
    return cleaned

# Save file
def save_text(filename,text):
    path = os.path.join(output_dir,filename )
    with open(path, "w") as f:
        f.write(text)
    return path

# Main Program

metadata = []
path = input("Enter file path: ")

# TXT
if path.lower().endswith(".txt"):
    doc_name = os.path.basename(path)

    with open(path, "r") as file:
        raw_text = file.read()

    cleaned = clean_text(raw_text)

    out_file = f"{doc_name}_cleaned.txt"
    out_path = save_text(out_file, cleaned)

    metadata.append({
        "document": doc_name,
        "output_file": out_path
    })

    print("\n---CLEANED TXT FILE---")
    print(cleaned)

# PDF

elif path.lower().endswith(".pdf"):
    doc_name = os.path.basename(path)
    reader = PdfReader(path)

    for i, page in enumerate(reader.pages, start = 1):
        raw_page = page.extract_text() or ""
        cleaned_page = clean_text(raw_page)

        out_file = f"{doc_name}_page_{i}.txt"
        out_path = save_text(out_file, cleaned_page)

        metadata.append({
            "document": doc_name,
            "page": i,
            "out_file": out_path
        })

        print(f"/n---PDF PAGE {i}---")
        print(cleaned_page)

# Unsupported File Type

else:
    print("Unsupported file type")

# Saving Metadata

meta_path = os.path.join(output_dir, f"metadata_{doc_name}.json")
with open(meta_path, "w") as f:
    json.dump(metadata, f, indent = 2)

print("\nMetadata saved to:", meta_path)