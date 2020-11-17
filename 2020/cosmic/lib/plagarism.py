# adapted from https://github.com/Kalebu/Plagiarism-checker-Python
# more info: https://dev.to/kalebu/how-to-detect-plagiarism-in-text-using-python-dpk

import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

cosmic_files = [doc for doc in os.listdir() if doc.endswith('.txt')]
cosmic_notes = [open(File).read() for File in  cosmic_files]

vectorize = lambda Text: TfidfVectorizer().fit_transform(Text).toarray()
similarity = lambda doc1, doc2: cosine_similarity([doc1, doc2])

vectors = vectorize(cosmic_notes)
s_vectors = list(zip(cosmic_files, vectors))
plagiarism_results = set()

def check_plagiarism():
    global s_vectors
    for cosmic_a, text_vector_a in s_vectors:
        new_vectors =s_vectors.copy()
        current_index = new_vectors.index((cosmic_a, text_vector_a))
        del new_vectors[current_index]
        for cosmic_b , text_vector_b in new_vectors:
            sim_score = similarity(text_vector_a, text_vector_b)[0][1]
            cosmic_pair = sorted((cosmic_a, cosmic_b))
            score = (cosmic_pair[0], cosmic_pair[1],sim_score)
            plagiarism_results.add(score)
    return plagiarism_results

for data in check_plagiarism():
    print(data)
