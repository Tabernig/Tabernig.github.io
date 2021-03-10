import pclpy
import os
import sys
import numpy as np

os.chdir("D:/OneDrive - uibk.ac.at/Uni/MScGeographie/Semester 2/VU Automatisierung")

fobj = open("./Daten/testcoordinates.txt","r")
myfile = []
for line in fobj:
    line= line.strip()
    getrennte_Line = line.split(" ")
    print(getrennte_Line)
    row = []
    for element in getrennte_Line:
        value = float(element)
        row.append(value)
        print(value)
    myfile.append(row)

myfileArray = np.array(myfile)
print(myfileArray)


#print(type(fobj))
fobj.close()

fobj_Out = open("./Daten/ausgabe.txt","w")
for myline in myfileArray:
    i = 0
    for element in myline:
        fobj_Out.write(str(element))
        if i == 0:
            fobj_Out.write(";")
            i+=1
    fobj_Out.write("\n")

fobj_Out.close()

np.savetxt("./Daten/ausgabeNp.txt",myfileArray)


print("Done.")

