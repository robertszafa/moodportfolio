This is readme just for us (NOT PRODUCTION) to keep things simple.

TO RUN THE CODE, FIRST **ENSURE THAT YOU ARE IN THE (server/ai/) directory!**

Now follow the steps:

## STEP 1 - PREREQUISITIES
```$ pip install -r requirements.txt```

## STEP 2: GENERATING IMAGES FROM DATASETS and CSVs

### ASK ME FOR THE fer2013.csv file (too big to upload here).
Save the file in the (server/ai/) directory (where the fer2013new.csv file is stored)
Now - 

** To create and store the images run **:
```
cd src
python getImages.py -d ../data -fer '../fer2013.csv' -ferplus '../fer2013new.csv'
``` 

## STEP 3 - TRAIN

I have already trained 4 epochs (i.e. epoch number 0 to 3). That trained model is checkpointed and stored in (server/ai/data/models) folder

### **TO RESTORE TRAINING FROM A CHECKPOINT**
```
cd src
python -W ignore train.py -d ../data -ckp ../data/models/model_3 -e 4
```
**NOTE:-** 
HERE, I AM RESTORING after the training for two epochs (epoch 1) was completed.
```HENCE -ckp ../data/models/model_3
-e 4 says to resume from epoch 4 (since epoch 3 is already done).
```

SO FOR EXAMPLE, if someone trained till epoch number 10 (11 epochs), you will see model_10 in server/ai/data/models directory
SO YOUR COMMAND WILL BE:
```
cd src
python -W ignore train.py -d ../data -ckp ../data/models/model_10 -e 11
```
(to tell code to resume from epoch 11.)

TOTAL OF 100 EPOCHS (epoch number 99 is final!)

**NOTE:-** load `model_0`, not `model_0.ckp` !!!!!!!

