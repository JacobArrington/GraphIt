from app.models import db, Datafile,User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_datafiles():
    users = User.query.all()
    for user in users:
        datafile1 = Datafile(
            user_id=1,
            filename="sales",
            file_type="csv",
            file_path="https://drive.google.com/file/d/1khnf6dyveLC2aeXYuDfj-1K79fi0UM9C/view?usp=share_link",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        datafile2 = Datafile(
            user_id=1,
            filename="weather",
            file_type="json",
            file_path="https://drive.google.com/file/d/1Dsirw5YHyDVvsjsr6p8Mes39W5Tv6Cip/view?usp=share_link",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        datafile3 = Datafile(
            user_id=1,
            filename="studentscores",
            file_type="csv",
            file_path="https://drive.google.com/file/d/1A0CvAgTSM1HWWrZrftreF52KVBJOPfKS/view?usp=share_link",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        datafile4 = Datafile(
            user_id=1,
            filename="sales",
            file_type="json",
            file_path="https://drive.google.com/file/d/1J6pkEIIen5_SbNkquazfb_l0vcMDPQ0c/view?usp=sharing",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        datafile5 = Datafile(
            user_id=1,
            filename="movies",
            file_type="xlsx",
            file_url="https://drive.google.com/file/d/1Bx8G0A-SVtxpVqePKJc6_THglh2Vj92J/view?usp=share_link",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        datafile6 = Datafile(
            user_id=1,
            filename="prodSales",
            file_type="xlsx",
            file_url="https://docs.google.com/spreadsheets/d/1QhjLwhNxXP6ifRaE8AB7pBu4-6LejlAs/edit?usp=share_link&ouid=100988712670363741152&rtpof=true&sd=true",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        db.session.add(datafile1)
        db.session.add(datafile2)
        db.session.add(datafile3)
        db.session.add(datafile4)
        db.session.add(datafile5)
        db.session.add(datafile6)

    db.session.commit()

def undo_datafiles():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.data_files RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM data_files"))

    db.session.commit()
