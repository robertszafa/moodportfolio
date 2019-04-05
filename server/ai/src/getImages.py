"""
Open FER2013, use the pixels to obtain images. Store it in relevant folders for Testing, Training and Validation
Note- get image name from FER+.csv
"""
import pandas as pd
import numpy as np
from PIL import Image
import os
import argparse

# Dictionary of folders for training, validation and test.
folder_names = {'Training'   : 'FER2013Train',
                'PublicTest' : 'FER2013Valid',
                'PrivateTest': 'FER2013Test'}

def createFolders(base_folder):
    """ Create the folders for storing images for training, testing and validation, if they don't exist.
	Parameters
	------------
	base_folder : string
		where 3 folders will be created.
    """
    for (key,val) in folder_names.items():
        folder_path = os.path.join(base_folder,val)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

def pixelsToImage(strPixelArray):
    """ Converts an array of pixels to image.
	Parameters
	------------
	strPixelArray : Array of string.
		has all pixel values separated by spaces.
    Returns
	-----------
	image : Image Object
    """
    image_string = strPixelArray.split(' ')
    image_data = np.asarray(image_string, dtype=np.uint8).reshape(48,48)
    #split to individual pixels. convert str to int
    return Image.fromarray(image_data)

def genImages(base_folder= '../data',fer_path= '../fer2013.csv',ferplus_path= '../fer2013new.csv'):
    """Opens csv with FER and FER+ dataset. 
    Creates images from the pixels in FER
    Names images from FER+"""

    fer_path = '../fer2013.csv'
    ferplus_path = '../fer2013new.csv'
    base_folder = '../data'
    createFolders(base_folder)
    
    #pening of datasets and preprocess.
    df = pd.read_csv(ferplus_path)   
    df = df.fillna(' ') #change any NaNs to "x"
    #row 1 is column names. need others. row[1] - image names.    
    image_names = df.iloc[1:,1].tolist()
    #df.iloc is type Pandas.series. Need normal list for iteration.
    
    #open fer2013.csv.
    df2 = pd.read_csv(fer_path)    
    allImagePixels = df2.iloc[1:,1].tolist() #row[1] has all pixels.
    usage = df2.iloc[1:,2].tolist() #training, testing or validation?

    print('Generating images...')

    for i in range (len(allImagePixels)):
        #for every set of pixels, create image from pixel, name it and save it in appropriate folder.
        if not image_names[i]== ' ': # ignore the images with no names...
            image = pixelsToImage(allImagePixels[i])
            path_to_save = os.path.join(base_folder,folder_names[usage[i]],image_names[i])
            #os.path.join for cross-platform use.
            image.save(path_to_save,compress_level=0)
            #save this image in respective diary.

    print('Done. Check ', base_folder)

if __name__ == "__main__":    
	parser = argparse.ArgumentParser()
    parser.add_argument("-d", 
                        "--base_folder", 
                        type = str, 
                        help = "Base folder containing the training, validation and testing folder.", 
                        required = True)
    parser.add_argument("-fer", 
                        "--fer_path", 
                        type = str,
                        help = "Path to the original fer2013.csv file.",
                        required = True)
                        
    parser.add_argument("-ferplus", 
                        "--ferplus_path", 
                        type = str,
                        help = "Path to the new fer2013new.csv file.",
                        required = True)                        

    args = parser.parse_args()
    genImages(args.base_folder, args.fer_path, args.ferplus_path)
