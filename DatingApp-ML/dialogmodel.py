from pytorch_transformers import GPT2Tokenizer, GPT2DoubleHeadsModel

model = GPT2DoubleHeadsModel.from_pretrained('gpt2')
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')

special_tokens = ['<start>','<end>','<speaker1>', '<speaker2>','<pad>']

tokenizer.add_tokens(special_tokens)
model.resize_token_embeddings(len(tokenizer))

from itertools import chain

persona = persona = [["i", "like", "playing", "football", "."],
           ["i", "am", "from", "NYC", "."]]
history = [["hello", "how", "are", "you", "?"],
           ["i", "am", "fine", "thanks", "."]]
reply = ["great", "to", "hear"]

bos, eos, speaker1, speaker2 = "<start>", "<end>", "<speaker1>", "<speaker2>"

def build_inputs(persona, history, reply):
    # Build our sequence by adding delimiters and concatenating
    sequence = [[bos] + list(chain(*persona))] + history + [reply + [eos]]
    sequence = [sequence[0]] + [ [speaker2 if (len(sequence)-i) % 2 else speaker1] + s
                                for i, s in enumerate(sequence[1:])]
    # Build our word, segments and position inputs from the sequence
    words = list(chain(*sequence))                          # word tokens
    segments = [speaker2 if i % 2 else speaker1             # segment tokens
                for i, s in enumerate(sequence) for _ in s]
    position = list(range(len(words)))                      # position tokens
    return words, segments, position, sequence

words, segments, position, sequence = build_inputs(persona, history, reply)

# >>> print(sequence)  # Our inputs looks like this:
# [['<bos>', 'i', 'like', 'playing', 'football', '.', 'i', 'am', 'from', 'NYC', '.'],
#  ['<speaker1>', 'hello', 'how', 'are', 'you', '?'],
#  ['<speaker2>', 'i', 'am', 'fine', 'thanks', '.'],
#  ['<speaker1>', 'great', 'to', 'hear', '<eos>']]

# Tokenize words and segments embeddings:
words = tokenizer.convert_tokens_to_ids(words)
segments = tokenizer.convert_tokens_to_ids(segments)

import torch

distractor = ['sorry','to','hear','that']

word_distractor, segment_distractor,_,_ = build_inputs(persona, history, distractor)
word_distractor = tokenizer.convert_tokens_to_ids(word_distractor)
segment_distractor = tokenizer.convert_tokens_to_ids(segment_distractor)

lm_targets = ([-1] * sum(len(s) for s in sequence[:-1])) \
             + [-1] + tokenizer.convert_tokens_to_ids(sequence[-1][1:])
lm_distractor = [-1] * len(word_distractor)

last_token = len(words) - 1
last_token_distractor = len(word_distractor) - 1

padding_length = max(len(words), len(word_distractor))
def pad(x, padding):
    return x + [padding] * (padding_length - len(x))

(words, words_distractor,
 segments, segments_distractor) = [pad(x, tokenizer.convert_tokens_to_ids('<pad>'))
                                   for x in (words, word_distractor,
                                             segments, segment_distractor)]

(lm_targets, lm_distractor) = [pad(x, -1) for x in (lm_targets, lm_distractor)]

# And gather reply and distractor inputs to build the input tensors:
# words tokens
input_ids = torch.tensor([[words, words_distractor]], dtype=torch.long)
# segment tokens
token_type_ids = torch.tensor([[segments, segments_distractor]], dtype=torch.long)
# Positions tokens can be automatically created by the model as (0, 1, ..., N)
# Last tokens location
mc_token_ids = torch.tensor([[last_token, last_token_distractor]], dtype=torch.long)
# Language modeling labels
lm_labels = torch.tensor([[lm_targets, lm_distractor]], dtype=torch.long)
# Next-sentence prediction labels
mc_labels = torch.tensor([0], dtype=torch.long)  # Gold reply is 1st (index 0)


# Forward pass
outputs = model(input_ids, mc_token_ids, lm_labels, mc_labels, token_type_ids)

# Total loss as a weighted sum
# lm_coef = 2.0
# mc_coef = 1.0
# total_loss = lm_loss * lm_coef + mc_loss * mc_coef

import json
from pytorch_transformers import cached_path

path = "datasets/data_tolokers.json"

# Download and load JSON dataset
personachat_file = cached_path(path)
with open(personachat_file, "r", encoding="utf-8") as f:
    dataset = json.loads(f.read())

# Tokenize and encode the dataset using our loaded GPT tokenizer
def tokenize(obj):
    if isinstance(obj, str):
        return tokenizer.convert_tokens_to_ids(tokenizer.tokenize(obj))
    if isinstance(obj, dict):
        return dict((n, tokenize(o)) for n, o in obj.items())
    if isinstance(obj, int):
        return
    if isinstance(obj, list):
        return [tokenize(o) for o in obj]
    
 
dataset = tokenize(dataset)