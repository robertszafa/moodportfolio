# FER+
The FER+ annotations provide a set of new labels for the standard Emotion FER dataset. In FER+, each image has been labeled by 10 crowd-sourced taggers, which provide better quality ground truth for still image emotion than the original FER labels. Having 10 taggers for each image enables researchers to estimate an emotion probability distribution per face. This allows constructing algorithms that produce statistical distributions or multi-label outputs instead of the conventional single-label output, as described in: https://arxiv.org/abs/1608.01041

The format of the CSV file is as follows: usage,	neutral, happiness,	surprise, sadness, anger, disgust, fear, contempt, unknown, NF. Columns "usage" is the same as the original FER label to differentiate between training, public test and private test sets. The other columns are the vote count for each emotion with the addition of unknown and NF (Not a Face).

## Datasets and CSVs:

# PS: ASK ME FOR THE fer2013.csv file (too big to upload here)

**_fer2013new.csv_** - usage (train,test or validation),image name, emotion confidence values for 8+2 emotions
(neutral,happiness,surprise,sadness,anger,disgust,fear,contempt,unknown,Non-Face)

**_fer2013.csv_** - main emotion,image name, pixel values

The pixels must be converted to images and stored in the right sub-folders within [data](data)

To store the images run:
```
cd src
python getImages.py -d <dataset base folder> -fer <fer2013.csv path> -ferplus <fer2013new.csv path>
```
For example:
```
cd src
python getImages.py -d ../data -fer '../fer2013.csv' -ferplus '../fer2013new.csv'
``` 

if  both the csvs are stored in the parent folder (/server/ai)

## Training
My implementation uses PLD training mode (Probabilistic Label Drawing) described in https://arxiv.org/abs/1608.01041.
```
cd src
python -W ignore train.py -d <dataset base folder> -e <number of epochs>
```
for example: `python -W ignore train.py -d ../data -e 1`

## FER+ layout for Training
There is a folder named data that has the following layout:
```
/data
  /FER2013Test
    label.csv
  /FER2013Train
    label.csv
  /FER2013Valid
    label.csv
```
*label.csv* in each folder contains the actual label for each image, the image name is in the following format: ferXXXXXXXX.png, where XXXXXXXX is the row index of the original FER csv file. So here the names of the first few images:
```
fer0000000.png
fer0000001.png
fer0000002.png
fer0000003.png
```
# Citation
If you use the new FER+ label or the sample code or part of it in your research, please cite the following:

**@inproceedings{BarsoumICMI2016,  
&nbsp;&nbsp;&nbsp;&nbsp;title={Training Deep Networks for Facial Expression Recognition with Crowd-Sourced Label Distribution},  
&nbsp;&nbsp;&nbsp;&nbsp;author={Barsoum, Emad and Zhang, Cha and Canton Ferrer, Cristian and Zhang, Zhengyou},  
&nbsp;&nbsp;&nbsp;&nbsp;booktitle={ACM International Conference on Multimodal Interaction (ICMI)},  
&nbsp;&nbsp;&nbsp;&nbsp;year={2016}  
}**
