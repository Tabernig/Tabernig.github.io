import os
import numpy as np



os.chdir("D:/_Programmieren/repos/Tabernig.github.io/VU_Automatisierung")


rowOrColumn = "row"
fobj = open("./Uebungsaufgaben/pointcloud1_small.txt","r")
fobj_Out = open("ausgabe.txt","w")

myfile = []
for line in fobj:
    line= line.strip()
    getrennte_Line = line.split("\t")
    row = []
    count = 0
    for element in getrennte_Line:
        if count <2:
            value = float(element)
            row.append(value)
            count +=1
        else:
            pass
    myfile.append(row)



myfileArray = np.array(myfile)


if rowOrColumn == "row":
    myfileArray = np.transpose(myfileArray)
    for row in myfileArray:
        i = 0
        for element in row:
            if i == 0:
                fobj_Out.write(str(element))
                i += 1
            elif i > 0:
                fobj_Out.write(";"+str(element))
        fobj_Out.write("\n")
else:
    for myline in myfileArray:
        i = 0
        for element in myline:
            fobj_Out.write(str(element))
            if i == 0:
                fobj_Out.write("\n")
                i+=1
        fobj_Out.write("\n")

#print(fobj_Out)


# #aufruf
# print(args.infile)
# print(args.outfile)
# print(args.outmode)

fobj.close()
fobj_Out.close()
print("Done.")