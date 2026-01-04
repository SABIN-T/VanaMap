from PIL import Image
import sys
import os

def resize_icon(input_path, output_dir):
    try:
        img = Image.open(input_path)
        sizes = [192, 384, 512]
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Save main logo ref
        # img.save(os.path.join(os.path.dirname(output_dir), 'logo.png')) 

        for size in sizes:
            new_img = img.resize((size, size), Image.Resampling.LANCZOS)
            output_name = f"icon-{size}x{size}.png"
            new_img.save(os.path.join(output_dir, output_name))
            print(f"Generated {output_name}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    resize_icon(
        r"C:\Users\sabin\.gemini\antigravity\scratch\plant-finder\frontend\public\logo.png",
        r"C:\Users\sabin\.gemini\antigravity\scratch\plant-finder\frontend\public\icons"
    )
