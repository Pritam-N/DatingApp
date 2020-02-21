# -*- coding: utf-8 -*-
"""
Created on Wed Feb 19 19:02:01 2020

@author: JOHN DOE
"""

import numpy as np
import pandas as pd

import torch
from pytorch_transformers import GPT2Tokenizer, GPT2LMHeadModel

tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
model = GPT2LMHeadModel.from_pretrained('gpt2')
model.eval()

stopWords =[',', '!', '.', '?', '/', '\n']

def predict(text):
    list = []
    indexed_tokens = tokenizer.encode(text)
    tokens_tensor = torch.tensor([indexed_tokens])
    outputs = model(tokens_tensor)
    predictions = outputs[0]
    predictions[0][0][0]
    sorted_length, sorted_index = torch.sort(predictions[0 ,-1, :], dim = 0, descending=True)
    new_sentence_order = sorted_index.tolist()
    predicted_index = new_sentence_order[0]
    predicted_text = tokenizer.decode(indexed_tokens + [predicted_index])
    text =  predicted_text
    list.append(text)    
    #def getCompleteSentence(text,stopwords):
    countwords = 0
    while(1): 
        countwords = countwords + 1
        indexed_tokens = tokenizer.encode(list[0])
        tokens_tensor = torch.tensor([indexed_tokens])
        
        with torch.no_grad():
            outputs = model(tokens_tensor)
            predictions = outputs[0]
                
        predicted_index = torch.argmax(predictions[0, -1, :]).item()
        predicted_text = tokenizer.decode(indexed_tokens + [predicted_index])
        list[0] = predicted_text
        if any(predicted_text.endswith(s) for s in stopWords):
            break
        if(countwords >= 10 ):
            break
    return list[0]