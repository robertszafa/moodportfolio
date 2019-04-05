import cntk as ct
from loadData import ImageData

class AIRecognizer(object):

    def __init__(self,base_folder='../data',max_epochs=100):

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

        self.trainingValues = ImageData('../data','FER2013Train',"label.csv",
            self.model.input_height,self.model.input_width,
            self.num_classes,False)
        
        self.validationValues = ImageData('../data','FER2013Valid',"label.csv",
            self.model.input_height,self.model.input_width,
            self.num_classes,True)
        
        self.testingValues = ImageData('../data','FER2013Test',"label.csv",
            self.model.input_height,self.model.input_width,
            self.num_classes,True)

    def modelInit(self):

        self.model = VGG13()
        self.input_var =ct.input((1, self.model.input_height,
            self.model.input_width),np.float32)
        self.label_var = ct.input((self.num_classes), np.float32) 

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

    def train(self):
        # Get minibatches of images to train with and perform model training
        max_val_accuracy    = 0.0
        final_test_accuracy = 0.0
        best_test_accuracy  = 0.0
        best_epoch = 0

        minibatch_size = 32
        epoch = 0
        while epoch < self.max_epochs :
            # start vapas, reset all readers etc.. 


            # Training 
            start_time = time.time()
            training_loss = 0
            training_accuracy = 0
            
            #mini-batch learning
            while self.trainingValues.hasMoreMinibatches():
            #while there is data for a mini batch:
                x,y = self.trainingValues.getNextMinibatch(minibatch_size)
                # x - images y - labels/emotions
                trainer.train_minibatch({self.input_var : x, self.label_var: y})

                






            epoch +=1

        


