import requests
import os
import time

API_KEY = "AIzaSyCkjsI6CkzuFfcwS-u4ZyLQo-0c1nYgUTo"
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

def get_models():
    url = f"{BASE_URL}/models?key={API_KEY}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json().get('models', [])
        else:
            print(f"Failed to list models: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error listing models: {e}")
        return []

def test_generate(model_name):
    url = f"{BASE_URL}/{model_name}:generateContent?key={API_KEY}"
    payload = {
        "contents": [{
            "parts": [{"text": "Hello"}]
        }]
    }
    
    try:
        print(f"Testing {model_name}...", end=" ", flush=True)
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            print("SUCCESS")
            return True
        elif response.status_code == 429:
            print("QUOTA EXCEEDED")
        else:
            print(f"FAILED ({response.status_code})")
        
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def main():
    print("Fetching available models...")
    models = get_models()
    
    candidate_models = [
        m['name'] for m in models 
        if 'generateContent' in m.get('supportedGenerationMethods', [])
    ]
    
    # Sort to prioritize standard/flash models over experimental/pro if possible
    # But for now, we just want *any* working model.
    
    print(f"Found {len(candidate_models)} candidates. Testing connectivity...")
    
    for model_name in candidate_models:
        if test_generate(model_name):
            print(f"\n>>> FOUND WORKING MODEL: {model_name} <<<\n")
            # Clean up the name for the frontend (remove 'models/' prefix if standard SDK usage requires it, 
            # though usually it handles both. We'll strip it to be safe).
            short_name = model_name.replace("models/", "")
            print(f"Please use: {short_name}")
            return
        
        # Small delay to avoid hammering the API if we aren't already blocked
        time.sleep(1)

    print("\nNO WORKING MODELS FOUND. ALL EXCEEDED QUOTA OR FAILED.")

if __name__ == "__main__":
    main()
