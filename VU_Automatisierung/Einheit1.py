import pclpy
import os
import sys

os.chdir("D:/OneDrive - uibk.ac.at/Uni/MScGeographie/Semester 2/VU Automatisierung")

fobj = open("./Daten/testcoordinates.txt","r")

for i in fobj:
    print(i)

fobj.close()
print("Done.")

