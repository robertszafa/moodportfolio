# FER +
Need both FER and FER+. Can't upload FER to github due to large size.
PS - JUST ASK ME DIRECTLY.
please find the original FER data set [here](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data)
# Training

### Training data
We provide a simple script `generate_training_data.py` in python that generates png images from **_fer2013.csv_** and **_fer2013new.csv_**  process. Images are stored in [data](/data)
```
python getImages.py 
```

# Citation

**@MISC{Goodfeli-et-al-2013,
       author = {Goodfellow, Ian and Erhan, Dumitru and Carrier, Pierre-Luc and Courville, Aaron and Mirza, Mehdi and Hamner, Ben and Cukierski, Will and Tang, Yichuan and Thaler, David and Lee, Dong-Hyun and Zhou, Yingbo and Ramaiah, Chetan and Feng, Fangxiang and Li, Ruifan and Wang, Xiaojie and Athanasakis, Dimitris and Shawe-Taylor, John and Milakov, Maxim and Park, John and Ionescu, Radu and Popescu, Marius and Grozea, Cristian and Bergstra, James and Xie, Jingjing and Romaszko, Lukasz and Xu, Bing and Chuang, Zhang and Bengio, Yoshua},
     keywords = {competition, dataset, representation learning},
        title = {Challenges in Representation Learning: A report on three machine learning contests},
         year = {2013},
  institution = {Unicer},
          url = {http://arxiv.org/abs/1307.0414}
}**

**@inproceedings{BarsoumICMI2016,  
&nbsp;&nbsp;&nbsp;&nbsp;title={Training Deep Networks for Facial Expression Recognition with Crowd-Sourced Label Distribution},  
&nbsp;&nbsp;&nbsp;&nbsp;author={Barsoum, Emad and Zhang, Cha and Canton Ferrer, Cristian and Zhang, Zhengyou},  
&nbsp;&nbsp;&nbsp;&nbsp;booktitle={ACM International Conference on Multimodal Interaction (ICMI)},  
&nbsp;&nbsp;&nbsp;&nbsp;year={2016}  
}**
