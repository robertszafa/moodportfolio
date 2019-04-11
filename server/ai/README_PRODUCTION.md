# FER+
The FER+ annotations provide a set of new labels for the standard Emotion FER dataset. In FER+, each image has been labeled by 10 crowd-sourced taggers, which provide better quality ground truth for still image emotion than the original FER labels. Having 10 taggers for each image enables researchers to estimate an emotion probability distribution per face. This allows constructing algorithms that produce statistical distributions or multi-label outputs instead of the conventional single-label output, as described in: https://arxiv.org/abs/1608.01041

The format of the CSV file is as follows: usage,	neutral, happiness,	surprise, sadness, anger, disgust, fear, contempt, unknown, NF. Columns "usage" is the same as the original FER label to differentiate between training, public test and private test sets. The other columns are the vote count for each emotion with the addition of unknown and NF (Not a Face).

## FOR ALL THE CODE BELOW ENSURE YOU ARE IN THE (server/ai/) directory!

## STEP 1: PREREQUISITES:
```pip install -r requirements.txt```

## STEP 2: GENERATING IMAGES FROM DATASETS and CSVs

# PS: ASK ME FOR THE fer2013.csv file (too big to upload here)

**_fer2013new.csv_** - usage (train,test or validation),image name, emotion confidence values for 8+2 emotions
(neutral,happiness,surprise,sadness,anger,disgust,fear,contempt,unknown,Non-Face)

**_fer2013.csv_** - main emotion,image name, pixel values

The pixels must be converted to images and stored in the right sub-folders within [data](data)

**To store the images run **:
```
cd src
python getImages.py -d <dataset base folder> -fer <fer2013.csv path> -ferplus <fer2013new.csv path>
```
For example:
```
cd src
python getImages.py -d ../data -fer '../fer2013.csv' -ferplus '../fer2013new.csv'
``` 

if  both the csvs are stored in the parent folder (/server/ai/)

## STEP 3: TRAINING

My implementation uses PLD training mode (Probabilistic Label Drawing) described in https://arxiv.org/abs/1608.01041.

### TO START THE TRAINING FROM SCRACTH (100 EPOCHS):
```
cd src
python -W ignore train.py -d <dataset base folder>
```
for example: `python -W ignore train.py -d ../data`

### **TO RESTORE TRAINING FROM A CHECKPOINT**
```
cd src
python -W ignore train.py -d ../data -ckp ../data/models/model_0 -e 1
```
**NOTE:-** all checkpoints are stored in `../data/models` folder
HERE, I AM RESTORING after the training for first epoch (epoch 0) was completed.
```HENCE -ckp ../data/models/model_0
-e 1 says to resume from epoch 1 (since epoch 0 is already done).
```

## STEP 4 : TESTING
All testing code is in `EmotionDetector.py`


# Citation
If you use the new FER+ label or the sample code or part of it in your research, please cite the following:

**@inproceedings{BarsoumICMI2016,  
&nbsp;&nbsp;&nbsp;&nbsp;title={Training Deep Networks for Facial Expression Recognition with Crowd-Sourced Label Distribution},  
&nbsp;&nbsp;&nbsp;&nbsp;author={Barsoum, Emad and Zhang, Cha and Canton Ferrer, Cristian and Zhang, Zhengyou},  
&nbsp;&nbsp;&nbsp;&nbsp;booktitle={ACM International Conference on Multimodal Interaction (ICMI)},  
&nbsp;&nbsp;&nbsp;&nbsp;year={2016}  
}**
