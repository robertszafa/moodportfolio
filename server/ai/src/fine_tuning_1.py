import cntk as ct
import numpy as np
#from cntk.graph import find_by_name, get_node_outputs

# Creates the network model for transfer learning
def clone_model(model_path): #, num_classes, input_features, new_prediction_node_name='prediction', freeze=False):
    # Load the pretrained classification net and find nodes
    base_model = ct.load_model(model_path)
    print(base_model.find_by_name('conv1-1').name)
    """
    node_outputs = ct.logging.get_node_outputs(base_model)
    for l in node_outputs: 
        print("  {0} {1}".format(l.name, l.shape))
    """
    #Obtain the named node using:
    flayer = cntk.combine([z.find_by_name('conv1-1').owner])
    #Then you can evaluate to obtain outputs using eval:
    output = flayer.eval(mb[...])
    

    
    feature_node = C.logging.find_by_name(base_model, model_path['feature_node_name'])
    last_node = C.logging.find_by_name(base_model, model_path['last_hidden_node_name'])

    # Clone the desired layers with fixed weights
    cloned_layers = C.combine([last_node.owner]).clone(
        ct.CloneMethod.clone,{feature_node: C.placeholder(name='features')})

    # Add new dense layer for class prediction
    feat_norm = input_features - C.Constant(114)
    cloned_out = cloned_layers(feat_norm)
    z = C.layers.Dense(num_classes, activation=None, name=new_prediction_node_name) (cloned_out)

    return z
    

create_model('../vgg13.model')