from sqlalchemy import Column, String #, Integer
from sqlalchemy.orm import Session
#from sqlalchemy.sql import base
from . import models, database #, schemas

'''
import bcrypt


def get_user_by_username(db: Session, username: str):
    return db.query(models.UserInfo).filter(models.UserInfo.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = models.UserInfo(username=user.username, password=hashed_password, fullname=user.fullname)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def check_username_password(db: Session, user: schemas.UserAuthenticate):
    db_user_info: models.UserInfo = get_user_by_username(db, username=user.username)
    return bcrypt.checkpw(user.password.encode('utf-8'), db_user_info.password.encode('utf-8'))
'''

def get_station_codes(db: Session):
    return db.query(models.StationModel).all()



def get_rain_data(db: Session, code: str):
    
    #create model
    class RainWeatherModel(database.Base):
        __tablename__ = "rain" + code
        __table_args__ = {'extend_existing': True}

        product_code = Column(String(50))
        station_number = Column(String(50))
        year = Column(String(50), primary_key=True)
        month = Column(String(50), primary_key=True)
        day = Column(String(50), primary_key=True)
        rainfall_amount = Column(String(50))
        measure_in_days = Column(String(50))
        quality = Column(String(50))

    return db.query(RainWeatherModel).all()



    
def get_minTemp_data(db: Session, code: str):
    
    #create model
    class MinTempWeatherModel(database.Base):
        __tablename__ = "min_temp" + code
        __table_args__ = {'extend_existing': True}

        product_code = Column(String(50))
        station_number = Column(String(50))
        year = Column(String(50), primary_key=True)
        month = Column(String(50), primary_key=True)
        day = Column(String(50), primary_key=True)
        min_temp_celsius = Column(String(50))
        days_of_accumulation = Column(String(50))
        quality = Column(String(50))

    return db.query(MinTempWeatherModel).all()
    

def get_maxTemp_data(db: Session, code: str):
    
    #create model
    class MaxTempWeatherModel(database.Base):
        __tablename__ = "max_temp" + code
        __table_args__ = {'extend_existing': True}

        product_code = Column(String(50))
        station_number = Column(String(50))
        year = Column(String(50), primary_key=True)
        month = Column(String(50), primary_key=True)
        day = Column(String(50), primary_key=True)
        max_temp_celsius = Column(String(50))
        days_of_accumulation = Column(String(50))
        quality = Column(String(50))

    return db.query(MaxTempWeatherModel).all()



def get_solar_data(db: Session, code: str):
    
    #create model
    class SolarWeatherModel(database.Base):
        __tablename__ = "solar" + code
        __table_args__ = {'extend_existing': True}
        
        product_code = Column(String(50))
        station_number = Column(String(50))
        year = Column(String(50), primary_key=True)
        month = Column(String(50), primary_key=True)
        day = Column(String(50), primary_key=True)
        solar_exposure = Column(String(50))

    return db.query(SolarWeatherModel).all()
