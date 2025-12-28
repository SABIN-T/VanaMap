@echo off
echo Starting VanaMap AI Service...
cd ai-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
