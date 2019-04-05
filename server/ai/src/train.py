import os
import time
import argparse
import cntk as ct
import numpy as np

from loadData import ImageData
from modelArchitecture import VGG13

class AIRecognizer(object):

    def __init__(self,base_folder='../data',max_epochs=100):
        self.base_folder = base_folder
        self.emotion_table = {'neutral'  : 0, 
                 'happiness': 1, 
                 'surprise' : 2, 
                 'sadness'  : 3, 
                 'anger'    : 4, 
                 'disgust'  : 5, 
                 'fear'     : 6, 
                 'contempt' : 7}
        self.num_classes = len(self.emotion_table)
        self.max_epochs = max_epochs

        self.modelInit()
        self.train()

#DO PLD - PROBABILISTIC LABEL DRAWING

    def genData(self):

        print("generating training image data")
        self.trainingValues = ImageData(self.base_folder,'FER2013Train',
            "label.csv",self.model.input_height,self.model.input_width,
            self.num_classes,False)
        
        print("generating validation image data")
        self.validationValues = ImageData(self.base_folder,'FER2013Valid',
            "label.csv", self.model.input_height,self.model.input_width,
            self.num_classes,True)
        
        print("generating testing image data")
        self.testingValues = ImageData(self.base_folder,'FER2013Test',
            "label.csv", self.model.input_height,self.model.input_width,
            self.num_classes,True)

    def modelInit(self):

        #create output model folder:
        output_model_folder = os.path.join(self.base_folder, R'models')
        if not os.path.exists(output_model_folder):
            os.makedirs(output_model_folder)

        self.model = VGG13()
        self.input_var =ct.input((1, self.model.input_height,
            self.model.input_width),np.float32)
        self.label_var = ct.input((self.num_classes), np.float32) 

        print("initialized model")

        self.genData()
        #ct.input_variables takes the no. of dimensions. and automatically creates 
        #1-hot encoded. ct.input doesn't. 

        #criterian of model: loss, metric:
        #loss = cross_entropy_with_softmax
        #metric = classification error
        z = self.model.model(self.input_var)
        loss = ct.cross_entropy_with_softmax(z, self.label_var)
        metric = ct.classification_error(z, self.label_var) 

        """
        pred = ct.softmax(z)
        loss = ct.negate(ct.reduce_sum(ct.element_times(label_var, ct.log(pred)), axis=-1)) 
        """
        minibatch_size = 32
        epoch_size = self.trainingValues.getLengthOfData()

        #THROW MOMENTUM:
        lr_per_minibatch = [self.model.learning_rate]*20 + [self.model.learning_rate / 2.0]*20 + [self.model.learning_rate / 10.0]
        #use eta for 20 minibatches, then half of eta for other 20 batches then eta/10 for remaining minimaches
        mm_time_constant = -minibatch_size/np.log(0.9)
        lr_schedule = ct.learning_rate_schedule(lr_per_minibatch,
            unit=ct.UnitType.minibatch, epoch_size=epoch_size)
        mm_schedule = ct.momentum_as_time_constant_schedule(mm_time_constant)

        # construct the trainer 
        #learner performs model updates. can be adam() or sgd()
        learner = ct.momentum_sgd(z.parameters, lr_schedule, mm_schedule)
        # The Trainer optimizes the loss by SGD, and logs the metric
        self.trainer = ct.Trainer(z, (loss, metric), learner)

        print("created trainer and learner")

    def train(self):
        # Get minibatches of images to train with and perform model training
        max_val_accuracy    = 0.0
        final_test_accuracy = 0.0
        best_test_accuracy  = 0.0
        best_epoch = 0

        minibatch_size = 32
        epoch = 0
        while epoch < self.max_epochs :
            print("\nepoch: ", epoch)
            # reset
            self.trainingValues.reset() 
            self.validationValues.reset() 
            self.testingValues.reset() 

            # Training 
            start_time = time.time()
            training_loss = 0
            training_accuracy = 0
            
            print("TRAINING")

            #mini-batch learning
            while self.trainingValues.hasMoreMinibatches():
                #while there is data for a mini batch:
                x,y,currBatchSize = self.trainingValues.getNextMinibatch(minibatch_size)
                # x - images y - labels/emotions
                self.trainer.train_minibatch({self.input_var : x, 
                    self.label_var: y})

                #maintain stats:
                training_loss += self.trainer.previous_minibatch_loss_average *    currBatchSize
                training_accuracy += self.trainer.previous_minibatch_evaluation_average * currBatchSize
                
            training_accuracy /= self.trainingValues.getLengthOfData()
            training_accuracy = 1.0 - training_accuracy
        
            # Validation
            print("VALIDATION")
            val_accuracy = 0
            while self.validationValues.hasMoreMinibatches():
                #while there is data for a mini batch:
                x,y,currBatchSize = self.validationValues.getNextMinibatch(minibatch_size)
                # x - images y - labels/emotions
                val_accuracy += self.trainer.test_minibatch({self.input_var : x,
                    self.label_var: y}) * currBatchSize
            
            val_accuracy /= self.validationValues.getLengthOfData()
            val_accuracy = 1.0 - val_accuracy
            
            test_accuracy = 0
            # if validation accuracy goes higher, we compute test accuracy
            if val_accuracy > max_val_accuracy:
                best_epoch = epoch
                max_val_accuracy = val_accuracy

                self.trainer.save_checkpoint(os.path.join(output_model_folder, "model_{}".format(best_epoch)))

                print("TESTING (since validation accuracy went higher)")
                while self.testingValues.hasMoreMinibatches():
                    x,y,currBatchSize = self.testingValues.getNextMinibatch(minibatch_size)
                    test_accuracy += self.trainer.test_minibatch({self.input_var : x, self.label_var : y}) * currBatchSize
                
                test_accuracy /= self.testingValues.getLengthOfData()
                test_accuracy = 1.0 - test_accuracy

                final_test_accuracy = test_accuracy
                if final_test_accuracy > best_test_accuracy: 
                    best_test_accuracy = final_test_accuracy


            print("Epoch took:", time.time() - start_time, "seconds")
            print("training accuracy:\t\t{:.2f}%".format(training_accuracy*100))
            print("validation accuracy:\t\t{:.2f} %".format(val_accuracy * 100))
            print("test accuracy:\t\t{:.2f} %".format(test_accuracy * 100))

            epoch +=1

        print("Best validation accuracy:\t\t{:.2f} %, epoch {}, its test accuracy:\t\t{:.2f} %".format(max_val_accuracy * 100, best_epoch,final_test_accuracy * 100))
    
        print("Best test accuracy:\t\t{:.2f} %".format(best_test_accuracy* 100))

        

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", 
                        "--base_folder", 
                        type = str, 
                        help = "Base folder containing the training, validation and testing data.", 
                        required = True)
    parser.add_argument("-e", 
                        "--epochs", 
                        type = int,
                        default=100,
                        help = "Specify the number of epochs (defaults to 100)")

    args = parser.parse_args()
    AIRecognizer(args.base_folder, args.epochs)