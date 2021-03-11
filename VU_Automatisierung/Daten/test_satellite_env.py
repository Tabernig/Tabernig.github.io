import sys

try:
    import numpy 
    import matplotlib.pyplot as plt
    from osgeo import gdal
    import pandas
    import geopandas
    import rasterio
    import scipy 
    import xarray
    import sklearn
    import jupyterlab
    import argparse
    from pclpy import pcl
except:
    print("One of the packages could not be imported. Make sure you have installed all packages that are required.")


if not (sys.version_info.major == 3 and sys.version_info.minor >= 6):
    print("Detected Python <3.6. Update recommended.")
else:
    print("Python version alright.")