import sys

from osgeo import gdal
import numpy 
import matplotlib.pyplot as plt
import pandas
import geopandas
import rasterio
import scipy 
import xarray
import sklearn
import jupyterlab
import argparse


if not (sys.version_info.major == 3 and sys.version_info.minor >= 6):
    print("Detected Python <3.6. Update recommended.")
else:
    print("Python version alright.")