from sqlalchemy import Column, Integer, String
from sqlalchemy.sql.expression import true
from sql_app.database import Base


code = ''
'''
class UserInfo(Base):
    __tablename__ = "user_info"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    password = Column(String(50))
    fullname = Column(String(50), unique=True)


class Blog(Base):
    __tablename__ = "blog"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50))
    content = Column(String(50))
'''

class StationModel(Base):
    __tablename__ = "station"

    station = Column(String(50))
    sub_station = Column(String(50))
    code = Column(String(50), primary_key=True)

'''
class RainModel(Base):
    __tablename__ = code or "station"

    station = Column(String(50))
    sub_station = Column(String(50))
    code = Column(String(50), primary_key=True)

class MinTempModel(Base):
    __tablename__ = "station"

    station = Column(String(50))
    sub_station = Column(String(50))
    code = Column(String(50), primary_key=True)

class MaxTempModel(Base):
    __tablename__ = "station"

    station = Column(String(50))
    sub_station = Column(String(50))
    code = Column(String(50), primary_key=True)

class SolarModel(Base):
    __tablename__ = "station"

    station = Column(String(50))
    sub_station = Column(String(50))
    code = Column(String(50), primary_key=True)
'''