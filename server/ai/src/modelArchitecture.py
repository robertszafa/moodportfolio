#VGG-13
# https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/icmi2015_ChaZhang.pdf
# https://arxiv.org/pdf/1608.01041.pdf

from cntk import layers,default_options,relu,glorot_uniform

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

    @property
    def model(self):
        return self._model   

    def __init__(self,num_classes):
        self.constructArchitecture(num_classes)	 
		
    def constructArchitecture(self,num_classes):
        with default_options(activation=relu, init=glorot_uniform()):
            self._model =  layers.Sequential([
                layers.For(range(2), lambda i: [
                    layers.Convolution((3,3),[64,128][i], pad=True, 
                        name='conv{}-1'.format(i+1)),
                    layers.Convolution((3,3),[64,128][i], pad=True, 
                        name='conv{}-2'.format(i+1)),
                    layers.MaxPooling((2,2),strides=(2,2), 
                        name='pool{}-1'.format(i+1)),
                    layers.Dropout(0.25, name='drop{}-1'.format(i+1))
                ]),
                layers.For(range(2), lambda i: [
                    layers.Convolution((3,3),[256,256][i], pad=True, 
                        name='conv{}-1'.format(i+3)),
                    layers.Convolution((3,3),[256,256][i], pad=True, 
                        name='conv{}-2'.format(i+3)),
                    layers.Convolution((3,3),[256,256][i], pad=True, 
                        name='conv{}-3'.format(i+3)),
                    layers.MaxPooling((2,2),strides=(2,2), 
                        name='pool{}-1'.format(i+3)),
                    layers.Dropout(0.25, name='drop{}-1'.format(i+3))
                ]),
                layers.For(range(2), lambda i: [
                    layers.Dense(1024, activation=None,name='fc{}'.format(i+5)),
                    layers.Activation(activation=relu,name='relu{}'.format(i+5)),
                    layers.Dropout(0.5, name='drop{}'.format(i+5))
                ]),
                layers.Dense(num_classes, activation=None, name='output')
            ])