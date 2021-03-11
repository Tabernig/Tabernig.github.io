#Throw away Intensitys above 255 and cube the remaining.

import argparse
import numpy as np

parser = argparse.ArgumentParser(description="Dieses Skript öffnet eine ASCII-Datei mit Werten in 2 Spalten.")
parser.add_argument("infile",type=str,help="input file")
parser.add_argument("outfile",type=str,help="output file")
parser.add_argument("column",type=str,help="intensity column")

args = parser.parse_args()


fobj = open(args.infile,"r")
fobj_Out = open(args.outfile,"w")
intensity = float(args.column)


myfile = []
for line in fobj:
    line= line.strip()
    getrennte_Line = line.split("\t")
    row = []
    count = 0
    for element in getrennte_Line:
        if count == intensity and float(element) > 255:
            row.append("")
        elif count == intensity and float(element) <= 255:
            value = float(element)**2
            row.append(value)
        else:
            value = float(element)
            row.append(value)
        count += 1

    myfile.append(row)

myfileArray = np.array(myfile)


for myline in myfileArray:
    leng = len(myline)
    #print(leng)
    i = 1
    for element in myline:
        fobj_Out.write(str(element))
        if i < leng:
            fobj_Out.write(";")
            i+=1
    fobj_Out.write("\n")


#aufruf
print(args.infile)
print(args.outfile)


fobj.close()
fobj_Out.close()
print("Done.")

#cd D:\_Programmieren\repos\Tabernig.github.io\VU_Automatisierung\Uebungsaufgaben
#python D:\_Programmieren\repos\Tabernig.github.io\VU_Automatisierung\Uebungsaufgaben\Session1\cc_fit.py D:\_Programmieren\repos\Tabernig.github.io\VU_Automatisierung\Daten\pointcloud1_small.txt D:\_Programmieren\repos\Tabernig.github.io\VU_Automatisierung\Daten\ausgabeCC.txt 3