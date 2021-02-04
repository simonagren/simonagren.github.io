---
title: Bot Framework in Node.js - Adaptive Cards (part 7)
tags: ["botframework", "nodejs", "azure", "msteams", "msgraph", "pnp"]
cover: botframework6.png
author: Simon Ågren
---

![extend](./botframework6.png)

In the previous post, we added some helpers and enabled the user to call Microsoft Graph. We used examples with `GraphClient` and `PnPJs Graph` for hooking into the Azure Bot Service auth flow. And we also added some validation to the dialog using Microsoft Graph.

Now we will get a little fancy using Adaptive cards in the Bot. And if we want to use these in Microsoft Teams in prompts, it gets a little tricky. I will walk you through my ways of handling this.

# Sourcecode
The finished source code: [https://github.com/simonagren/simon-blog-bot-v7](https://github.com/simonagren/simon-blog-bot-v7)

# Prerequisites 
- [Bot Emulator](https://aka.ms/Emulator-wiki-getting-started)
- [Node.js 10.4+](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [An Azure Account](https://azure.microsoft.com/free/)
- [Office 365 dev tenant](https://developer.microsoft.com/office/dev-program) - for Microsoft Teams
- [Ngrok](https://ngrok.com/download)

# Project changes

## tsconfig.js
I've added two options in the `tsconfig` file that enable us to use `import` when it comes to JSON files. Without these, we would need to use a `require` syntax.

```json
"resolveJsonModule": true,
"esModuleInterop": true,
```

```typescript
import WelcomeCard from '../resources/welcome.json';
```

## Files we added
In the `src` folder we create an additional folder: `resources`. The folder contains 4 new files:

- **generic.json**: a generic Adaptive Card in JSON format. We will use this when prompting the user. 
- **siteTypes.json**: three Adaptive Cards in an array. Used as a carousel to select site type. 
- **summary.json**: an Adaptive Card that will replace the summary text.
- **welcome.json**: an Adaptive Card that will replace the welcome message from the Bot.

# Adaptive cards
It's not in scope to teach you everything regarding what Adaptive Cards are. You can read more [Here](https://adaptivecards.io/). Essentially you create a JSON structure with semantic values. The text could be `Large` and the color `Accent` - you declare an approximate, then the `host` renders the card. The Adaptive Card will look like native Teams, or Outlook, Cortana etc. You don't care about font-sizes and pixels while creating the cards.

# bot.ts
As we saw in the first post, we get normal text responses from the user via `context.activity.text`. Adaptive Card responses in Teams comes back via `context.activity.value`.
We need to be aware of this in general, but this also leads to workarounds for prompts in dialogs.

## Workaround
A workaround that I normally use is to catch the `context.activity.value` in the `OnMessage` method, and then set the empty `context.activity.text` with the value we got from `context.activity.value`

```typescript    
if (context.activity.text === undefined && context.activity.value ) {
    context.activity.text = JSON.stringify(context.activity.value);
}
```

This will not interrupt the normal flow. The Bot will, just as before, kick off the Main Dialog with the `context` that we slightly adapt. It will work the same as if the user would just have entered a text response in a normal prompt.

```typescript
// Run the Dialog with the new message Activity.
await (this.dialog as MainDialog).run(context, this.dialogState);
```

## CardFactory

We import `CardFactory` from `botbuilder`. You could either paste an Adaptive Card JSON, or import the value from a file like I have done (less cluttering).

```typescript
const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
```

The `adaptiveCard` method creates an `Attachment` object with the correct `content type` and the card JSON itself. For those of you familiar with these cards might have seen the content type before:

```typescript
'application/vnd.microsoft.card.adaptive'
```

And this is what the static method looks like

```typescript
public static adaptiveCard(card: any): Attachment {
    return { contentType: CardFactory.contentTypes.adaptiveCard, content: card };
}
```
## Sending Adaptive Cards
We change from just sending a message to send a card as an attachment. When using `attachments` in `context.sendActivity` it expects an array of attachments. So make sure you put the card into brackets.

```typescript
await context.sendActivity({ attachments: [welcomeCard] });
```

## Methods

### OnMessage
This is what OnMessage looks like now
```typescript
this.onMessage(async (context, next) => {
      
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

### OnMembersAdded
This is what OnMembersAdded looks like now
```typescript
this.onMembersAdded(async (context, next) => {
    const membersAdded = context.activity.membersAdded;
    const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
    for (const member of membersAdded) {
    if (member.id !== context.activity.recipient.id) {
        await context.sendActivity({ attachments: [welcomeCard] });
    }
    }
    // By calling next() you ensure that the next BotHandler is run.
    await next();
});
```

# siteDialog.ts

## Removals
I removed `CHOICE_PROMPT` and `TITLE_PROMPT` constants, and also the `.addDialog()` for them.

## Imports

Imports from `botbuilder` for types and Attachment creation.
```typescript
import { Attachment, AttachmentLayoutTypes, CardFactory } from 'botbuilder';
```

Adaptive cards
```typescript
import GenericCard from '../resources/generic.json';
import SiteTypesCard from '../resources/siteTypes.json';
import SummaryCard from '../resources/summary.json';
```

## siteTypeStep
This step has changed from a `ChoicePrompt` to a `TextPrompt`. We will instead use the adaptive card `SiteTypesCard` for the choices. If you recall, it contains an array of three different adaptive cards in JSON-format. That's why I'm using `.map()` to create an array of Attachments. We use a different `attachmentLayout` in the form of a carousel. 

We first send the Adaptive Card as an attachment. We then send a Text prompt - but with no text. The Text prompts makes sure we are waiting for user input. When the user clicks on one of the cards we will (through the workaround) catch the response and add it to the `siteDetails` just like before.

```typescript
private async siteTypeStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const siteDetails = stepContext.options as SiteDetails;

    if (!siteDetails.siteType) {

        const siteTypeCards: Attachment[] = SiteTypesCard.cards.map((card: any) => CardFactory.adaptiveCard(card));
        await stepContext.context.sendActivity({ 
            attachmentLayout: AttachmentLayoutTypes.Carousel, 
            attachments: siteTypeCards 
        });

        return await stepContext.prompt(TEXT_PROMPT, '');

    } else {
        return await stepContext.next(siteDetails.siteType);
    }
}
```

## titleStep
In this step the validation is removed. It was just an example that we don't need. Now we are using a `TEXT_PROMPT` here as well. 

We are using the `GenericCard` that was prepared with a `$Placeholder` variable. We will re-use this generic card in many of the steps and do a `.replace()` in the JSON with the "text value" we want to prompt the user. We first send the card and then prompt the user with an empty text value to await a response.

```typescript
private async titleStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const siteDetails = stepContext.options as SiteDetails;

    siteDetails.siteType = stepContext.result.value;

    if (!siteDetails.title) {

        const promptText = `Provide a title for your ${siteDetails.siteType} site`;
        const titleCard: Attachment = CardFactory.adaptiveCard(JSON.parse(
            JSON.stringify(GenericCard).replace('$Placeholder', promptText)));
        
        await stepContext.context.sendActivity({ attachments: [titleCard] });
        return await stepContext.prompt(TEXT_PROMPT, '');
    } else {
        return await stepContext.next(siteDetails.title);
    }
}
```

## confirmStep
This step uses the `SummaryCard` that I prepared with multiple placeholder values. Worth noting is that it's still a ConfirmPrompt.

```typescript
private async confirmStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const siteDetails = stepContext.options as SiteDetails;

    // Capture the results of the previous step
    siteDetails.alias = stepContext.result;
    
    const summaryCard: Attachment = CardFactory.adaptiveCard(JSON.parse(
        JSON.stringify(SummaryCard)
            .replace('$Title', siteDetails.title)
            .replace('$Desc', siteDetails.description)
            .replace('$Owner', siteDetails.owner)
            .replace('$Type', siteDetails.siteType)
            .replace('$Alias', siteDetails.alias ? siteDetails.alias : '' )
            ));

    await stepContext.context.sendActivity({ attachments: [summaryCard] });

    // Offer a YES/NO prompt.
    return await stepContext.prompt(CONFIRM_PROMPT, { prompt: '' });
}
```

## Workaround 2
Another workaround would be to create your own Prompt class. 

I just created a prompt that extends the normal text prompt, and I override the onRecognize method to work with both `value` and `text`

```typescript
import { TextPrompt, PromptOptions, PromptRecognizerResult, PromptValidator } from "botbuilder-dialogs";
import { TurnContext } from "botbuilder";

export class AdaptiveTextPrompt extends TextPrompt {
    
    /**
     * Creates a new Adaptive Card TextPrompt instance.
     */
    constructor(dialogId: string, validator?: PromptValidator<string>){
        super(dialogId, validator);
    }
    
    async onRecognize(context: TurnContext, state: any, options: PromptOptions): Promise<PromptRecognizerResult<string>> { 
        let value: any;
        
        if (context.activity.text === undefined && context.activity.value ) {
            value = context.activity.value; 
            return typeof value === 'object' && value != undefined ? { succeeded: true, value: value } : { succeeded: false };
        } 
        else if (context.activity.value === undefined && context.activity.text ) {
            value = context.activity.text;
            return typeof value === 'string' && value.length > 0 ? { succeeded: true, value: value } : { succeeded: false };
        }
    }
}
```

# Next step
In this post, we looked at using Adaptive Cards in our prompts.

In the next post, we will use proactive messaging in a secure manner.


