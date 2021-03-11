import argparse

parser = argparse.ArgumentParser(description="Dieses Skript öffnet eine ASCII-Datei mit Werten in 2 Spalten.")
parser.add_argument("-infile",type=str,help="input file")
parser.add_argument("-outfile",type=str,help="output file")

parser.add_argument("outmode",choices=["rows","columns"], help="mode if data is written in rows or columns")

args = parser.parse_args()

#aufruf
print(args.infile)
print(args.outfile)
print(args.outmode)

print("Done.")
