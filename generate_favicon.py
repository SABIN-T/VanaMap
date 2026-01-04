from PIL import Image
import os

def create_favicon(input_path, output_dir):
    try:
        img = Image.open(input_path)
        output_path = os.path.join(output_dir, 'favicon.ico')
        img.save(output_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print(f"Generated {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_favicon(
        r"C:\Users\sabin\.gemini\antigravity\scratch\plant-finder\frontend\public\logo.png",
        r"C:\Users\sabin\.gemini\antigravity\scratch\plant-finder\frontend\public"
    )
