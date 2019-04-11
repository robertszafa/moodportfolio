import argparse
import cntk as ct
import numpy as np
from PIL import Image
import pandas as pd

from img_preprocess import distort_img,compute_norm_mat,preproc_img
from rect_util import Rect
from loadData import Parameters


emotion_table = {0 : 'neutral'  , 
                 1 : 'happiness', 
                 2 : 'surprise' , 
                 3 : 'sadness'  , 
                 4 : 'anger'    , 
                 5 : 'disgust'  , 
                 6 : 'fear'     , 
                 7 :'contempt'  }

def test_SingleInstance(saved_model_path,img_path):
    model = ct.load_model(saved_model_path)
    out = ct.softmax(model)
    
    testingParams = Parameters(8,64,64, True, False)
    img = preprocessTestImage(img_path,testingParams)

    pred_probs = out.eval({out.arguments[0]:img})
    print(pred_probs)
    emotion = np.argmax(pred_probs)
    print(emotion_table[emotion])

def testSeveralInstances(saved_model_path):#,img_paths):
    model = ct.load_model(saved_model_path)
    out = ct.softmax(model)
    
    testingParams = Parameters(8,64,64, True, False)
    path = "../data/FER2013Test/"
    df = pd.read_csv(path + "label.csv")
    imageNames = df.iloc[:3500,0].values 
    box = df.iloc[:3500,1].values
    y = list(map(np.argmax,df.iloc[:3500,2:].values))

    for name in imageNames : 
        img = preprocessTestImage(path+name,testingParams)
        pred_probs = out.eval({out.arguments[0]:img})
        emotion = np.argmax(pred_probs)
        print(emotion_table[emotion])  
    

def preprocessTestImage(image_path,testingParams):

    image_data = Image.open(image_path)
    image_data.load()  
    img_box = [0,0,48,48]
    # face rectangle #(48,48)
    face_rc = Rect(img_box)

    distorted_image = distort_img(image_data, face_rc, 
                                            testingParams.width, 
                                            testingParams.height, 
                                            testingParams.max_shift, 
                                            testingParams.max_scale, 
                                            testingParams.max_angle, 
                                            testingParams.max_skew, 
                                            testingParams.do_flip)
    A, A_pinv = compute_norm_mat(testingParams.width,
        testingParams.height)
    final_image = preproc_img(distorted_image, A=A, A_pinv=A_pinv)
    final_image = np.expand_dims(final_image, axis=0)

    return final_image



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-m", 
                        "--saved_model", 
                        type = str,
                        help = "Specify the path where .dnn file is stored",
                        required = True)
    parser.add_argument("-p", 
                        "--img_path", 
                        type = str, 
                        help = "Location for the 1 image for testing.")
    parser.add_argument("-d", 
                        "--base_folder", 
                        type = str, 
                        help = "Folder containing the various images for testing.",
                        required = True)    
    
    args = parser.parse_args()   
    testSeveralInstances(args.saved_model)

    # python -W ignore EmotionDetector.py -m ../vgg13.model -d ../data/FER2013Test