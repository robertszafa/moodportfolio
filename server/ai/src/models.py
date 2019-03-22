#VGG-13
# https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/icmi2015_ChaZhang.pdf
# https://arxiv.org/pdf/1608.01041.pdf
from cntk import layers

class VGG13(object):

    @property
    def learning_rate(self):
        return 0.05
    # VGG13 expects 64 * 64 grayscale images.
    @property
    def input_width(self):
        return 64

    @property
    def input_height(self):
        return 64

    @property
    def input_channels(self):
        return 1

    # 8 emotions.
    @property
    def num_classes(self):
        return 8

    @property
    def model(self):
        return self._model   

    def __init__(self):
        self.constructArchitecture()	 
		
	def constructArchitecture(self):
        with ct.default_options(activation=relu, init=glorot_uniform()):
            self._model =  Sequential([
                For(range(4), lambda i: [
                    Convolution((3,3),[64,128,256,256][i], pad=True)
                    Convolution((3,3),64, pad=True)
                    MaxPooling((2,2),strides=(2,2))
                    Dropout(0.25)
                ]),
                For(range(2), lambda i: [
                    Dense(1024, activation=None),
                    Activation(activation=relu),
                    Dropout(0.5)
                ]),
                ct.layers.Dense(num_classes, activation=None)
            ])