from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io
import uvicorn

app = FastAPI()

# Allow all CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AI Service Running", "models": ["u2net"]}

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    try:
        # Read image
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents))
        
        # Remove background using U-2-Net (rembg default)
        output_image = remove(input_image)
        
        # Save to buffer
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        return Response(content=img_byte_arr, media_type="image/png")
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
