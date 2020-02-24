---
title: Bot Framework in Node.js - LUIS natural language processing
tags: ["botframework", "nodejs", "azure", "msteams", "typescript", "msgraph"]
cover: sitescript.png
author: Simon Ågren
---

![extend](./sitescript.png)

In the last post we had a look at proactive messages at a higher level, and implemented some token validation.

In this post we will have a look at using LUIS for natural language processing. The main goal is to give the Bot the ability to extract words from sentances and understand what we want to do.

## Prerequisites 

- Bot Emulator
- Node.js 10.4+
- Visual Studio Code
- An Azure Account (get one for free)
- Microsoft Teams
- Ngrok

# LUIS
LUIS language model setup, training, and application configuration steps can be found [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0).