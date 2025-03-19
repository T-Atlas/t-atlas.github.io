---
title: "Fact-Preserved Personalized News Headline Generation"
collection: publications
category: conferences
permalink: /publication/2023-12-01-fact-preserved
excerpt: 'This paper proposes a framework called Fact-Preserved Personalized News Headline Generation (FPG), which aims to balance the trade-off between personalization and factual consistency. We also devise an additional training procedure based on contrastive learning to further enhance the factual consistency of generated headlines.'
date: 2023-12-01
venue: '2023 IEEE International Conference on Data Mining (ICDM2023)'
slidesurl: 'http://t-atlas.github.io/files/ICDM2023_slides.pdf'
paperurl: 'http://t-atlas.github.io/files/ICDM2023_paper.pdf'
citation: 'Zhao Yang, **Junhong Lian** and Xiang Ao*. (2023). &quot;Fact-Preserved Personalized News Headline Generation.&quot; <i>In Proceedings of the 23rd IEEE International Conference on Data Mining (ICDM2023, short paper). Z. Yang and J. Lian are equally contributed.</i>.'
---

`Abstract` Personalized news headline generation, aiming at generating user-specific headlines based on readers’ preferences, burgeons a recent flourishing research direction. Existing studies generally inject a user interest embedding into an encoder-decoder headline generator to make the output personalized, while the factual consistency of headlines is inadequate to be verified. In this paper, we propose a framework Fact-Preserved Personalized News Headline Generation (short for FPG), to prompt a tradeoff between personalization and consistency. In FPG, the similarity between the candidate news to be exposed and the historical clicked news is used to give different levels of attention to key facts in the candidate news, and the similarity scores help to learn a fact-aware global user embedding. Besides, an additional training procedure based on contrastive learning is devised to further enhance the factual consistency of generated headlines. Extensive experiments conducted on a real-world benchmark PENS validate the superiority of FPG, especially on the tradeoff between personalization and factual consistency.