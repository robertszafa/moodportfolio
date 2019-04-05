import os
import csv
import numpy as np
import pandas as pd
from PIL import Image
import img_preprocess as imgUtils
from rect_util import Rect

class ImageData(object):

    def __init__(self, base_folder, sub_folder,labels_csv,
        image_height,image_width,num_classes,deterministic):
        

        self.data, self.indices = self.load_data(base_folder, 
            sub_folder,labels_csv)
        self.currentBatchStartPoint = 0
        self.lenOfData = 0
        self.height = image_height
        self.width = image_width
        self.A, self.A_pinv = imgUtils.compute_norm_mat(self.width, self.height)
        self.num_classes = num_classes

        # data augmentation - determinisitc
        if deterministic:
            self.max_shift = 0.0
            self.max_scale = 1.0
            self.max_angle = 0.0
            self.max_skew = 0.0
            self.do_flip = False
        else:
            self.max_shift = 0.08
            self.max_scale = 1.05
            self.max_angle = 20.0
            self.max_skew = 0.05
            self.do_flip = True


    def load_data(self,base_folder, sub_folder,labels_csv):
        ''' Load the actual images from disk. While loading, we normalize the 
        input data. '''
        folder_path = os.path.join(base_folder,sub_folder)
        file_path = os.path.join(folder_path,labels_csv)
        allData = []

        df = pd.read_csv(file_path)
        imageNames = df.iloc[:,0].values 
        box = df.iloc[:,1].values
        y = df.iloc[:,2:].values 
        #confidence of all 8 emotions + unknown + non-face.
        
        for i in range (len(y)):
            confidenceInFloat = list(map(float, y[i]))
            processesed_emotions = self.processEmotionForPLD(confidenceInFloat)

            if len(processesed_emotions) > 0 :
            # i.e. not invalid emotions:      
                image_path = os.path.join(folder_path,imageNames[i])    
                image_data = Image.open(image_path)
                image_data.load()  
                # face rectangle 
                img_box = list(map(int, box[i][1:-1].split(',')))
                face_rc = Rect(img_box)
                allData.append((image_path,image_data,processesed_emotions,face_rc))
        
        self.lenOfData = len(allData)
        indices = np.arange(self.lenOfData)
        np.random.shuffle(indices)  #shuffle data
        return allData,indices
        

    def processEmotionForPLD(self, emotions_raw):
        """
        Outlier Removal. Proces emotions for doing PLD - Probabilistic Label Drawing
        """
        size = len(emotions_raw)
        emotion = [0.0]*size #final processed emotions
        emotion_unknown = [0.0]*size
        emotion_unknown[-2] = 1.0

        #outlier removal - remove emotions with a single vote
        for i in range (size):
            if emotions_raw[i] == 1.0:
                emotions_raw[i] = 0.0
        
        sum_list = sum(emotions_raw)
        
        new_sum = 0
        count = 0
        valid_emotion = True
        """
        For PLD - consider the 3 largest emotion confidence as long as sum of
        these is 3/4 of original sum of confidences. (if max confidence in 
        unknown or no face, then STOP!)
        """
        while new_sum < 0.75*sum_list and count < 3 and valid_emotion:
        
            maxIdx = np.argmax(emotions_raw)
            if maxIdx < 8 : 
                # if unknown or non-face share same number of max votes, 
                # then IGNORE
                emotion[maxIdx] = emotions_raw[maxIdx]
                #set emotions_raw[maxIdx] to 0 so we can get next maximum
                emotions_raw[maxIdx] = 0
                #update new sum:
                new_sum += emotion[maxIdx]
                count += 1
            else : # if unknown or non-face share same number of max votes
                valid_emotion = False
                break       
        
        if sum(emotion) <= 0.5*sum_list or count > 3: 
            # less than 50% of the votes are integrated, 
            # or there are too many emotions, we'd better discard this example
            emotion = emotion_unknown   # force setting as unknown  
        
        #squash emotions confidences between 0 to 1 and
        #remove unknow, non-face values
        maxIdx = np.argmax(emotion)
        if maxIdx < 8:
            emotion = emotion[:-2]
            emotion = [float(i)/sum(emotion) for i in emotion]
            return emotion
        return []

    def hasMoreMinibatches(self):
        if self.currentBatchStartPoint == self.lenOfData:
            return False
        return True


    def getNextMinibatch(self,batch_size):
        #batch end point is either end of data or c=startpoint+batch size
        self.batchEndPoint = min(self.currentBatchStartPoint + batch_size, 
            self.lenOfData)
        
        #shape of x,y matrices. 1- channel first in cntk!
        inputs = np.empty(shape=(batch_size,1,self.height,self.width), 
            dtype=np.float32)
        targets=np.empty(shape=(batch_size,1,self.num_classes), 
            dtype=np.float32)

        for i in range(self.currentBatchStartPoint,self.batchEndPoint):
            index = self.indices[i]
            # (image_path,image_data,emotions) = self.data[index]
            distorted_image = imgUtils.distort_img(self.data[index][1], 
                                            self.data[index][3], 
                                            self.width, 
                                            self.height, 
                                            self.max_shift, 
                                            self.max_scale, 
                                            self.max_angle, 
                                            self.max_skew, 
                                            self.do_flip)
            final_image = imgUtils.preproc_img(distorted_image, A=self.A, 
                A_pinv=self.A_pinv)

        #add final_image and label to inputs and targets
        
        #SET NEW START BATCH POINT:::;->
        self.currentBatchStartPoint = self.batchEndPoint

    def getLengthOfData(self):
        return self.lenOfData

if __name__ == '__main__' :
	obj = ImageData('../data','FER2013Train',"label.csv",64,64,8,False)



