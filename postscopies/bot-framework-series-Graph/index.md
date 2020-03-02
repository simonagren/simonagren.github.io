---
title: Bot Framework in Node.js - Calling Microsoft Graph 
tags: ["botframework", "nodejs", "azure", "msteams", "typescript", "msgraph", "pnpjs"]
cover: sitescript.png
author: Simon Ågren
---

![extend](./sitescript.png)

# FIXA MED ALIAS RESOLVERDIALOG



# Introduction

I the last post we created a new Azure AD Application registration, gave it permissions to Microsoft Graph. We also added an OAuth promt to the dialogs and made it possible for the user to log in both in the emulator as well as Microsoft Teams.

In this post we will add some helpers and enable the user to utilize Microft Graph. We will create an example using both the `GraphClient` and `PnPJs Graph` for hooking in to the Azure Bot Service auth flow. And in this example we will add some additional validation into the dialogs as well.

# Sourcecode
It is the same source as the previous post: [https://github.com/simonagren/simon-blog-bot-v3](https://github.com/simonagren/simon-blog-bot-v3)

# Prerequisites 
- [Bot Emulator](https://aka.ms/Emulator-wiki-getting-started)
- [Node.js 10.4+](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [An Azure Account](https://azure.microsoft.com/free/)
- [Office 365 dev tenant](https://developer.microsoft.com/office/dev-program) - for Microsoft Teams
- [Ngrok](https://ngrok.com/download)

# Getting a token from the Azure Bot Service

In the last post we saw that we will get a token from the `OAuthPrompt` after the user logs in. We will not store the token locally after (which I explained more in the last post). To receive the token we will call the OAuth prompt again when we need it.

Normally you would have to add some `MSAL` or `ADAL` settings that the `GraphClient` or `PnPJs` would use to fetch a token, and then use to call Microsoft Graph.

But this time we have already received the token and we will work with that in the clients.

# Project changes

## npm packages

We will install these packages:
- [Microsoft Graph Client](https://www.npmjs.com/package/@microsoft/microsoft-graph-client)
    ```json
    npm i @microsoft/microsoft-graph-client
    ```
- [Microsoft Graph Types](https://www.npmjs.com/package/@microsoft/microsoft-graph-types)    
    ```json
    npm i @microsoft/microsoft-graph-types
    ```
- [PnPjs: Graph and NodeJs](https://pnp.github.io/pnpjs/getting-started/#connect-to-microsoft-graph-from-node)
    ```json
    npm i @pnp/graph-commonjs @pnp/nodejs-commonjs
    ```
## Files we added
In the `src` folder we create an additional folder `helpers`. This will in our case contain 3 new files:

- **graphHelper.ts**: the Microsoft Graph helper class, that will contain examples utilizing both `simple-graph-client` and `simple-pnpjs-client` to call Microsoft Graph. 
- **simple-graph-client.ts**: wiring up the `GraphClient` from Microsoft, with the token from the Bot. Contains methods to call Microsoft Graph.
- **simple-pnpjs-client.ts**: wiring up the `PnPJs` graph client from `Patterns And Practices (PnP)`, with the token from the Bot. Contains methods to call Microsoft Graph.

![newfiles](./newfiles.png)


## simple-graph-client.ts

### Imports

We import the Microsoft Graph `Client` and also the types for `User`. 

```typescript
import { Client } from '@microsoft/microsoft-graph-client';
import { User } from '@microsoft/microsoft-graph-types';
```

### Variables and constructor
- Before the constructor we have added a few private variables.
- The constructor now expects the property `token`
- After making sure that we get the token, we initialize the Graph `Client` with the token.

```typescript
private token: string;
private graphClient: Client;

constructor(token: any) {
    if (!token || !token.trim()) {
        throw new Error('SimpleGraphClient: Invalid token received.');
    }

    this.token = token;

    // Get an Authenticated Microsoft Graph client using the token issued to the user.
    this.graphClient = Client.init({
        authProvider: (done) => {
            done(null, this.token); // First parameter takes an error if you can't get an access token.
        }
    });
}
```

### Methods

Only one simple method to check if a user exists

```typescript
/**
* Check if a user exists
* @param {string} emailAddress Email address of the email's recipient.
*/
public async userExists(emailAddress: string): Promise<User> {
    if (!emailAddress || !emailAddress.trim()) {
        throw new Error('SimpleGraphClient.userExists(): Invalid `emailAddress` parameter received.');
    }
    return await this.graphClient
        .api(`/users/${emailAddress}`)
        .get().then((res: User) => {
            return res;
        });
    }
```

## simple-pnpjs-client.ts

### Imports

We import the Microsoft Graph types for `User`, `graph` from the PnPjs Graph package (with an alias) and also `BearerTokenFetchClient` from the PnPjs Nodejs package.

If you have seen some more of my posts I usually use the `AdalTokenFetchClient`, where you supply the `clientId` and `clientSecret` of you Azure AD application. But this time we already have a token som the `BearerTokenFetchClient` is perfect in this scenario. 

```typescript
import { User } from '@microsoft/microsoft-graph-types';
import { graph as graphClient } from "@pnp/graph-commonjs";
import { BearerTokenFetchClient } from "@pnp/nodejs-commonjs";
```

### Variables and constructor
- Before the constructor we have added a private variable.
- The constructor now expects the property `token`
- After making sure that we get the token, we initialize the PnPjs `graph` with the token, by using the `BearerTokenFetchClient`.

```typescript
private token: any;

constructor(token: any) {
    if (!token || !token.trim()) {
        throw new Error('SimpleGraphClient: Invalid token received.');
    }

    this.token = token;

    graphClient.setup({
        graph: {
            fetchClientFactory: () => {
                return new BearerTokenFetchClient(this.token);
            }
        }
    });
}
```

### Methods

Only one simple method to check if a user exists

```typescript
/**
* Check if a user exists
* @param {string} emailAddress Email address of the email's recipient.
*/
public async userExists(emailAddress: string): Promise<User> {
    if (!emailAddress || !emailAddress.trim()) {
        throw new Error('SimplePnPjsClient.userExists(): Invalid `emailAddress` parameter received.');
    }
    return await graphClient.users.getById(emailAddress).get();
}
```

## graphHelper.ts

### Imports
We used to have imported the two client wrappers.

```typescript
import { SimpleGraphClient } from './simple-graph-client';
import { SimplePnPJsClient } from './simple-pnpjs-client';	
```

### Methods

It only contains two methods so far: `userExists()` and `userExistsPnP`. They both do similar things, but uses the two different clients. They take both the `tokenResponse` and an `emailAddress` to call the Graph and see if that user exists based on the email.

```typescript
/**
* Let's the user see if the user exists using GraphClient
* @param {TokenResponse} tokenResponse A response that includes a user token.
* @param {string} emailAddress The email address of the user.
*/
public static async userExists(tokenResponse: any, emailAddress: string): Promise<boolean> {
    if (!tokenResponse) {
        throw new Error('GraphHelper.userExists(): `tokenResponse` cannot be undefined.');
    }
    const client = new SimpleGraphClient(tokenResponse.token);
    const user = await client.userExists(emailAddress);
    return user !== undefined;
}

/**
* Let's the user see if the user exists using PnPJs
* @param {TokenResponse} tokenResponse A response that includes a user token.
* @param {string} emailAddress The email address of the user.
*/
public static async userExistsPnP(tokenResponse: any, emailAddress: string): Promise<boolean> {
    if (!tokenResponse) {
        throw new Error('GraphHelper.userExists(): `tokenResponse` cannot be undefined.');
    }
    const client = new SimplePnPJsClient(tokenResponse.token);
    const user = await client.userExists(emailAddress);
    return user !== undefined;
}
```

## OwnerResolverDialog


Here we import the `OAuthPrompt`, and `GraphHelper`, add a new constant
```typescript
const OAUTH_PROMPT = 'OAuthPrompt';
```

We add a private variable to the top of the class
```typescript
private static tokenResponse: any;
```
and then add an additional `promptStep` and the `OAuthPrompt` using the connection.

```typescript
this
    .addDialog(new TextPrompt(TEXT_PROMPT, OwnerResolverDialog.ownerPromptValidator.bind(this)))
    .addDialog(new OAuthPrompt(OAUTH_PROMPT, {
          connectionName: process.env.connectionName,
          text: 'Please Sign In',
          timeout: 300000,
          title: 'Sign In' }))
    .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
          this.promptStep.bind(this),
          this.initialStep.bind(this),
          this.finalStep.bind(this)
        ]));
```

### promptStep

The prompt step only kicks off the new login prompt.

```typescript
private async promptStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    return await stepContext.beginDialog(OAUTH_PROMPT);
}
```

### initialStep
Just as the previous post the initial step has changed. It will now get the `token` from the previous step in the `stepcontext.result`. And if we didn't get a token, to login wasn't successfull.

```typescript
private async initialStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const tokenResponse = stepContext.result;
    if (tokenResponse && tokenResponse.token) {
      
      OwnerResolverDialog.tokenResponse = tokenResponse;

      const siteDetails = (stepContext.options as any).siteDetails;
      const promptMsg = 'Provide an owner email';

      if (!siteDetails.owner) {
        return await stepContext.prompt(TEXT_PROMPT, {
          prompt: promptMsg
        });
      } else {
        return await stepContext.next(siteDetails.owner);
      }
    }
    await stepContext.context.sendActivity('Login was not successful please try again.');
    return await stepContext.endDialog();
  }
```

### ownerPromptValidator
Here we have added some additional validation to make sure, not only that the email is correctly formatted, but also a valid existing user.

```typescript
private static async ownerPromptValidator(promptContext: PromptValidatorContext<string>): Promise<boolean> {
    if (promptContext.recognized.succeeded) {
      
      const owner: string = promptContext.recognized.value;
      if (!OwnerResolverDialog.validateEmail(owner)) {
        promptContext.context.sendActivity('Malformatted email adress.');
        return false;
      }
      
      // THIS IS NEW
      if (!await GraphHelper.userExists(owner, OwnerResolverDialog.tokenResponse))  {
        promptContext.context.sendActivity('User doesn\'t exist.');
        return false;
      }

      return true;

    } else {
      return false;
    }
  }
```


