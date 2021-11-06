import uvicorn
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sql_app import models, schemas, crud
from sql_app.database import engine, SessionLocal


#models.Base.metadata.create_all(bind=engine)
#ACCESS_TOKEN_EXPIRE_MINUTES = 30

#define variables
wo = '' #weather option

app = FastAPI()

# Dependency
origins = ["http://localhost:3000", "localhost:3000", "localhost"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()



@app.get("/station")
def get_st_codes(db: Session = Depends(get_db)):
    codes = crud.get_station_codes(db)
    if not codes:
        raise HTTPException(status_code=400, detail="Data does not exist")
    return codes


@app.get("/{weather_option}/{code}")
def rain_data(code: str, weather_option: str, db: Session = Depends(get_db)):
    weather = ''
    if weather_option == 'Rainfall':        
        weather = crud.get_rain_data(db, code)
    elif weather_option == 'Minimum Temperature':
        weather = crud.get_minTemp_data(db, code)
    elif weather_option == 'Maximum Temperature':
        weather = crud.get_maxTemp_data(db, code)
    elif weather_option == 'Solar Exposure':
        weather = crud.get_solar_data(db, code)    
    
    if not weather:
        raise HTTPException(status_code=400, detail="Data does not exist")
    return weather





if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8081)
