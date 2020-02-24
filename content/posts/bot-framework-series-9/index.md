---
title: Bot Framework in Node.js - Messaging extensions
tags: ["botframework", "nodejs", "azure", "msteams", "typescript", "msgraph"]
cover: sitescript.png
author: Simon Ågren
---

![extend](./sitescript.png)

In this last post I will show you how to create unit tests for our Bot. 

## Prerequisites 

- Bot Emulator
- Node.js 10.4+
- Visual Studio Code
- An Azure Account (get one for free)
- Microsoft Teams
- Ngrok

## Proactive messages
Proactive messages could look a bit different. They could (as we looked at earlier) give a predefined welcome message, it could be a notification from another system. And we could mention people, create new conversations with people and even continue conversations.
In our case we will look at continueing a conversation.

## add an endpoint
One of the examples out there is to add an API endpoint `/api/notify`. And for all conversations, save those specific conversation references.
And then via a GET, have the Bot send a predefined message to all the saved conversationReferences.

### an example
So what if we want to send a message to a specific conversation Id?
I made an architecture where you basicly order a Site or a Team via the Bot. The Bot saves the metadata (including the conversationId) in SharePoint -> Flow sends to an Azure Queue -> triggers Azure Durable Functions -> Durable functions provisionins the site, artifacts, settings etc. And EACH time something is done, the Azure Function sends a message to the Bot - which continues the conversation. 
So the user get's messages like: "creating lists...", "finished creating lists".

### message all conversations 
```typescript
for (const conversationReference of Object.values(conversationReferences)) {
        await adapter.continueConversation(conversationReference, async turnContext => {
            // If you encounter permission-related errors when sending this message, see
            // https://aka.ms/BotTrustServiceUrl
            await turnContext.sendActivity('proactive hello');
        });
    }
```

## Token validation
The problem as I see it is that anyone could post something to that endpoint now, so we need to do something in order to make sure we only receive the messages we want. 

### processActivity
Looking at the normal api/messages we could see that the `adapter` has a method (`processActivity`) that parses and authenticates the incoming request. Inspects the bearer token in the auth header, and compares this with our credentials (appId and secret).

```typescript
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
```
### continueConversation
This method works similarry in the way that it creates the context, runs trough the middleware and then continues the conversation. The problem as I see it, is that there's no token validation included in this one.

### one solution
I did a rather sloppy example on how we could do to make sure we are allowed to post messages. This could be a bit refined, but whatever.

- First we are checking to see if we have a conversation reference Id and a message.
- Then we have imported the JwtTokenValidation from the Bot Framework Connector, and we are just validating the token vs our credentials.
- If authentication is ok, we get the reference from the conversational references. In reality this should probably be persisted in a database or something similar. Now we actually have to "create a conversation" first (write something to the Bot), before we could notify the user this way.
- Then we just send the message to the user.

```typescript
server.post('/api/notify', async (req, res) => {
    if (req.body.refId && req.body.message) {
        const authHeader = req.headers.authorization || '';
        const claims = await JwtTokenValidation.validateAuthHeader(authHeader, credentialsProvider, null, null);
        if (claims.isAuthenticated) {
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
            // If we're not authorized
            res.send(401);
        }
    } else {
        // If we don't have reference Id and a message
        res.send(400);
    }
});
```

### api/notify
What I tried to do is make a simpler version of this just to make sure that we have a valid token at least, so we could send a message from PowerShell or Postman for instance.


