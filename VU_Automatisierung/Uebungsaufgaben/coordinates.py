import argparse

parser = argparse.ArgumentParser(description="Dieses Skript öffnet eine ASCII-Datei mit Werten in 2 Spalten.")
parser.add_argument("-infile",type=str,help="input file")
parser.add_argument("-outfile",type=str,help="output file")

parser.add_argument("outmode",choices=["rows","columns"], help="mode if data is written in rows or columns")
args = parser.parse_args()


rowOrColumn = args.outmode
fobj = open(args.infile,"r")
fobj_Out = open(args.outfile,"w")

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


#aufruf
print(args.infile)
print(args.outfile)
print(args.outmode)

fobj.close()
fobj_out.close()
print("Done.")

#cd D:\_Programmieren\repos\Tabernig.github.io\VU_Automatisierung\Uebungsaufgaben
#coordinates.py [-h] [-infile pointcloud1_small.txt] [-outfile ausgabe.txt] {rows}