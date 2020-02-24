---
title: Bot Framework in Node.js - Proactive messages and token validation 
tags: ["botframework", "nodejs", "azure", "msteams", "typescript", "msgraph"]
cover: sitescript.png
author: Simon Ågren
---

![extend](./sitescript.png)

# Introduction

In this post we got a little fancy using Adaptive cards in the Bot. And we talked about a few workarounds to have them working in `prompts` and how to collect the user input, especially when it comes to `Microsoft Teams`.

In this post we will have a look at proactive messages at a higher level, and try to be a little creative. And we will have a look at how to make sure that the messages we send to the Bot, and then to the users are coming from a trusted source - by validating the token.

# Sourcecode
This is the finished source code: [https://github.com/simonagren/simon-blog-bot-v5](https://github.com/simonagren/simon-blog-bot-v5)

# Prerequisites 
- [Bot Emulator](https://aka.ms/Emulator-wiki-getting-started)
- [Node.js 10.4+](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [An Azure Account](https://azure.microsoft.com/free/)
- [Office 365 dev tenant](https://developer.microsoft.com/office/dev-program) - for Microsoft Teams
- [Ngrok](https://ngrok.com/download)


# Proactive messages
Proactive messages could look a bit different. They could, as in the `onMembersAdded` give a predefined welcome message, it could be a `notification` from another system. And we could `mention` people, `create new conversations` with people and even `continue conversations`.
In our case we will look at continueing a conversation.

# Example: message all conversations
In the `proactive messages` Bot builder sample, they are saving all the conversations references, and they add an `restify` API endpoint `/api/notify`. Then when someone use a `GET` - http://localhost:3978/api/notify - the bot sends a predefined message to all the previous conversations.

```typescript
for (const conversationReference of Object.values(conversationReferences)) {
        await adapter.continueConversation(conversationReference, async turnContext => {
            // If you encounter permission-related errors when sending this message, see
            // https://aka.ms/BotTrustServiceUrl
            await turnContext.sendActivity('proactive hello');
        });
    }
```


# Message a specific conversation

Sometimes we want to message a specific user, and just continue that specific conversation. For that we need the Conversation Id. In our scenario now we will just "have it", but in reality you would have to save it somewhere from the Bot. 

The architecture I created and have demoed on some SharePoint Saturdays involves saving the values and passing it along to Azure. I will go over the whole scenario in a post later on, for now let's stick to our fictional scenario.

In this example we receive the `referenceId` in the body of a POST, and then we get that reference, continue the conversation and sends the `message` to the user, via the Bot.

```typescript
const reference = conversationReferences[req.body.refId];
// Proactively notify the user.
if (reference) {
    await adapter.continueConversation(reference, async (context) => {
        await context.sendActivity(req.body.message);
    });
```                

# Project changes

Just a brief walktrough and the rest will be explained in the other sections.

## index.ts

### Imports
We import `crypto` and some addional thing from `botbuilder`

```typescript
import * as crypto from 'crypto';
...

import { BotFrameworkAdapter, ConversationReference, ConversationState, MemoryStorage, UserState } from 'botbuilder';
```

### Code changes
We add a constand of `conversationReferences`, that we will use later when messaging the user. This is injected to the Bot.

```typescript
const conversationReferences: Array<Partial<ConversationReference>> = [];
const myBot = new SimonBot(conversationState, userState, dialog, conversationReferences);
```

I have also added a new `restify` API endpoint which allows `POST`. We will go over it in details further down.
```typescript
server.post('/api/notify', async (req, res) => {
...
```

## bot.ts

### Variables and constructor
I have added a private variable for `conversationReferences`, added a `@param`, and also a check to make sure that we actually receive the references. And just as before we initialize the private variable with what we got via the constructor.

### Methods
We have added a method for adding conversation references, and it looks like this:

```typescript
private addConversationReference(activity: Activity) {
    const conversationReference = TurnContext.getConversationReference(activity);
    this.conversationReferences[conversationReference.conversation.id] = conversationReference;
}
```

The `onMessage` noew utilizes that method
```typescript 
this.onMessage(async (context, next) => {
    
    this.addConversationReference(context.activity);

    // If result comes from an Adaptive Card
    if (context.activity.text === undefined && context.activity.value ) {
    context.activity.text = JSON.stringify(context.activity.value);
    }

    // Run the Dialog with the new message Activity.
    await (this.dialog as MainDialog).run(context, this.dialogState);

    // By calling next() you ensure that the next BotHandler is run.
    await next();
});
```

# How to make sure not anyone could just send a message?
The problem as I see it is that anyone could post something to that endpoint now, so we need to do something in order to make sure we only receive the messages we want. 

## processActivity
Looking at the normal api/messages we could see that the `adapter` has a method (`processActivity`) that parses and authenticates the incoming request. Inspects the bearer token in the auth header, and compares this with our credentials (appId and secret).

```typescript
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
```
## continueConversation
This method works simillary in the way that it creates the context, runs trough the middleware and then continues the conversation. The problem as I see it, is that there's no token validation included in this one.

## Validating via HMAC
We could utilize the HMAC concept, that is being utilized in Microsoft Teams Outgoing Web hooks, among other things.
It revolves around creating a `shared secret` (and rotate this now and then), I will store the secret in `Azure Key Vault` and use it as an enviroment variable. We generate a HMAC token based on the message we want to send, and the shared secret. Using standard `SHA256` cryptography and `UTF8`.

### PowerShell (our server side example)
Imagine we have an Azure Function in PowerShell. The function is doing something with the site we ordered and we will get messages from Azure. 

We get the `secret` from our enviroment variables, that we have gotten from Azure Key Vault.
We will generate the HMAC token from the message we want to send, in our case containing the refId and message. 

1. Convert message to a byte array in UTF8
```powershell
$message = '{"refId":"adf1b490-3315-11ea-8b32-436f2f76cf33|livechat","message":"Hello!"}'
$msgBuf = [Text.Encoding]::UTF8.GetBytes($message)
``` 
2. Convert secret to byte array in UTF8
```powershell
$secret = $env:hmacsecret
$secretBuf = [Text.Encoding]::UTF8.GetBytes($secret)
```
3. Create HMAC using SHA256 and add the secret byte array as key
```powershell
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = $bufSecret
```
4. Create the hash and convert to Base64 string
```powershell
$msgHash = 'HMAC ' + [Convert]::ToBase64String($hmac.ComputeHash($msgBuf))
```
5. Invoke a Post to the Bot notify endpoint using the message hash as authorization, and message itself in the body
```powershell
$header = @{
  "Accept"="application/json"
  "Authorization"=$msgHash
  "Content-Type"="application/json"
 }

Invoke-WebRequest -Uri "http://localhost:3978/api/notify" -Method POST -Headers $header -Body $message
```

### In the Bot
We will generate the HMAC token from the request body of the message and we will use Crypto. See the comments in the code. Since we in PowerShell based the hash on the same message we receive and the shared key, the result of the hash we create here should be the same.

```typescript
server.post('/api/notify', async (req, res) => {
    if (req.body.refId && req.body.message) {
        try {
            const authHeader = req.headers.authorization || '';
            // Get message from the request body and convert to a byte array in UTF8
            const messageStr = JSON.stringify(req.body);
            const msgBuf = Buffer.from(messageStr, 'utf8');
            // Use shared secret and convert to byte array i UTF8
            const sharedSecret = process.env.hmacSecret;
            const secretBuf = Buffer.from(sharedSecret, 'utf8');
            // create a SHA256 HMAC and convert to base64 string
            const msgHash = 'HMAC ' + crypto.createHmac('sha256', secretBuf).update(msgBuf).digest('base64');
            // Compare is the created message hash is the same is the one in the auth header
            if (msgHash === authHeader) {
                const reference = conversationReferences[req.body.refId];
                // Proactively notify the user.
                if (reference) {
                    await adapter.continueConversation(reference, async (context) => {
                        await context.sendActivity(req.body.message);
                    });
                    // Everything went ok
                    res.send(200);
                } else {
                    // Couldn't find reference
                    res.send(404);
                }
            } else {
                res.send(401);
            }
        } catch (err) {
            res.send(404, err);
        }
    }
});
```


