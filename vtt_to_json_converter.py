# Magiczna wyszukiwarka
# 
# Ten skrypt służy do konwertowania napisów WebVTT (.vtt) do formatu JSON
# Wygenerowane pliki JSON importujemy do MeiliSearch
import os
import json
import re

def get_last_id():
    counter_file = 'counter_for_resuming.txt'
    try:
        with open(counter_file, 'r') as f:
            return int(f.read().strip())
    except FileNotFoundError:
        return 0  # Start from 0 if file doesn't exist

def save_last_id(last_id):
    counter_file = 'counter_for_resuming.txt'
    with open(counter_file, 'w') as f:
        f.write(str(last_id))

def parse_vtt(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    # Remove WEBVTT header and empty lines
    content = re.sub(r'WEBVTT\n', '', content)
    content = re.sub(r'\n\n+', '\n\n', content)
    # Split into blocks
    blocks = content.strip().split('\n\n')
    parsed_data = []
    for block in blocks:
        lines = block.split('\n')
        if len(lines) >= 2:
            time_range, *text_lines = lines
            start_time, end_time = time_range.split(' --> ')
            text = ' '.join(text_lines)
            if len(text) >= 10:  # Only add entries with content length >= 10
                parsed_data.append((start_time, end_time, text))
    return parsed_data

def convert_vtt_to_json(input_folder, output_folder, max_file_size_mb):
    # Get the last used ID
    last_id = get_last_id()
    object_id = last_id + 1  # Start from the next available ID
    
    json_data = []
    file_count = 1  # Track the number of output files
    current_file_size = 0  # Track the current file size in bytes
    max_file_size = max_file_size_mb * 1024 * 1024  # Convert MB to bytes
    
    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)
    
    for root, dirs, files in os.walk(input_folder):
        for filename in files:
            if filename.endswith('.vtt'):
                file_path = os.path.join(root, filename)
                parsed_data = parse_vtt(file_path)
                # Remove .vtt extension from filename
                filename_without_ext = os.path.splitext(filename)[0]
                # Get the subdirectory name (streamer_name)
                streamer_name = os.path.relpath(root, input_folder)
                if streamer_name == '.':
                    streamer_name = 'root'
                
                for start_time, end_time, content in parsed_data:
                    entry = {
                        'id': object_id,
                        'streamer_name': streamer_name,
                        'filename': filename_without_ext,
                        'start_time': start_time,
                        'end_time': end_time,
                        'content': content
                    }
                    # Estimate the size of the new entry
                    entry_size = len(json.dumps(entry, ensure_ascii=False).encode('utf-8'))
                    
                    # Check if adding this entry exceeds the max file size
                    if current_file_size + entry_size > max_file_size:
                        # Write the current data to a file
                        output_file = os.path.join(output_folder, f'streamer_{file_count}.json')
                        with open(output_file, 'w', encoding='utf-8') as jsonfile:
                            json.dump(json_data, jsonfile, ensure_ascii=False, indent=2)
                        # Reset for the next file
                        json_data = []
                        current_file_size = 0
                        file_count += 1
                    
                    # Add the entry to the current data
                    json_data.append(entry)
                    current_file_size += entry_size
                    object_id += 1
    
    # Write any remaining data to a final file
    if json_data:
        output_file = os.path.join(output_folder, f'streamer_{file_count}.json')
        with open(output_file, 'w', encoding='utf-8') as jsonfile:
            json.dump(json_data, jsonfile, ensure_ascii=False, indent=2)
    
    # Save the last used ID
    save_last_id(object_id - 1)

# Usage
input_folder = '.'  # Current directory
output_folder = '.'  # Output folder for JSON files
max_file_size_mb = 100  # Maximum file size in MB
convert_vtt_to_json(input_folder, output_folder, max_file_size_mb)