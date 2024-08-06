import nltk
import os
import zipfile

# Define the path to the NLTK data directory
nltk_data_path = os.path.join(os.path.dirname(__file__), 'nltk_data')

# Create the directory if it does not exist
if not os.path.exists(nltk_data_path):
    os.makedirs(nltk_data_path)

# Download the required NLTK data
nltk.download('wordnet', download_dir=nltk_data_path)

# Check if the zip file exists and needs extraction
wordnet_zip_path = os.path.join(nltk_data_path, 'corpora', 'wordnet.zip')
if os.path.isfile(wordnet_zip_path):
    with zipfile.ZipFile(wordnet_zip_path, 'r') as zip_ref:
        zip_ref.extractall(os.path.join(nltk_data_path, 'corpora'))
    os.remove(wordnet_zip_path)  # Optional: remove the zip file after extraction

print("NLTK data setup complete.")



try:
    nltk.data.find('corpora/wordnet')
    print("WordNet found!")
except LookupError:
    print("WordNet not found")

print("NLTK data paths:", nltk.data.path)