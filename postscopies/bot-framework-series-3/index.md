---
title: Bot Framework in Node.js - Dialogs 
tags: ["botframework", "nodejs", "azure"]
cover: botframework2.png
author: Simon Ågren
---

![extend](./botframework2.png)

# Introduction

In the last post we tried the Bot in Microsoft Teams using `ngrok`. This post will be a bit code heavy, I felt like I needed to explain a lot what is going on behind the scenes. And hopefully this put things a bit into context. 

Dialogs are really powerfull in Bot Framework 4, and we could really utilize them in structured ways - even in more complicated branched conditional situations. We will try to stick to the basics, but at the same time prepare the Bot for upcoming posts.

## What we will build today

<img src="./bot.gif"/>


# Sourcecode
Here is the link to the Github repository for this post: [https://github.com/simonagren/simon-blog-bot-v2](https://github.com/simonagren/simon-blog-bot-v2)

# Prerequisites 
- [Bot Emulator](https://aka.ms/Emulator-wiki-getting-started)
- [Node.js 10.4+](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [An Azure Account](https://azure.microsoft.com/free/)
- [Office 365 dev tenant](https://developer.microsoft.com/office/dev-program) - for Microsoft Teams
- [Ngrok](https://ngrok.com/download)


# Dialogs in Bot Framework 4
We have a few different dialogs: `prompts`, `waterfall dialogs` and `component dialogs` 

## Prompts
Prompts are used to ask the user for input and wait until the user enters an input. If the value is valid the prompt returns the value, otherwise it will reprompt the user.
We have to ability to define our own validadators for each prompt.

We have a couple of different prompts, and among those:
- **Choice Prompt**: Asks for a choice from a set of options
- **Text prompt**: Asks for general text input
- **Confirm prompt**: Asks for a confirmation.
- **Number prompt**:	Asks for a number.
- **OAuth Prompt**: Asks the user to sign in using the Bot Frameworks Single Sign On (SSO) service

## Waterfall dialogs
A waterfall dialog is composed of a sequence of steps. Each step of the conversation is implemented as an asynchronous function that takes a waterfall step context parameter.
Usually in each step we prompt the user for input with (for instace a question), which then the user can respond to. 

![input](./input.png)

When we get the input from the use we will pass the result to the next step. 

Another option is to begin a child dialog from a step, and this could be as simple or complex as we want to build the branching.
You could read some more [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-dialog-manage-complex-conversation-flow?view=azure-bot-service-4.0&tabs=javascript) regarding complex conversation flows.

## Component dialogs
The component dialog makes it easy to create `resusable dialogs` for specific scenarios, and sometimes it makes sense to break up the bots logic into smaller pieces. A `component` could be added as a `dialog` to another `ComponentDialog` or `DialogSet` - we will use both of these scenarios in the Bot. 

We can have `Waterfall dialogs` and `prompts` in the each component and it will have its' own "dialog flow". The dialogs could be imported and run as a main dialog or started as child dialogs.

In our case we will have three components deriving from `ComponentDialog`:
- Our main component that we run from the Bot
  ```typescript
  export class MainDialog extends ComponentDialog {
  ``` 
- The site dialog that we will import to and run from `MainDialog` 
  ```typescript
  export class SiteDialog extends ComponentDialog {
  ``` 
- And the owner resolver dialog that will be used for displaying an own dialog for validation
  ```typescript
  export class OwnerResolverDialog extends ComponentDialog {
  ``` 

# Project changes

## Files we added
In the `src` folder we create an additional folder `dialogs`. This will in our case contain 4 new files:

- **mainDialog.ts**: The main dialog will now at first just kick of the site `siteDialog` and then collect the results. In upcoming posts we will add some additional steps.
- **siteDetails.ts**: the class that defines all the properties we use and need.
- **siteDialog.ts**:  Will contain the conversational flow between the user and the Bot, where the user "orders" a site.
- **ownerResolverDialog**: an example where we create a new dialog to validate user input.      

![newfiles](./newfiles.png)

## bot.ts
We have also done a few changes in the `bot.ts` file

### Imports
We used to have a single import from `botbuilder`. Now we have a couple more imports from `botbuilder` for handling state in the dialogs, and a few from  `botbuilder-dialogs`. We have also imported the `MainDialog` that we we will run. 

```typescript
import { ActivityHandler, BotState, ConversationState, StatePropertyAccessor, UserState } from 'botbuilder';	
import { Dialog, DialogState } from 'botbuilder-dialogs';	
import { MainDialog } from '../dialogs/mainDialog';	
```

And handling state is not in the scope of this post, you can read more [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-state?view=azure-bot-service-4.0)

### Variables and constructor
- Before the constructor we have added a few private variables.
- The constructor now expects properties `conversationState`, a `userState` and a `dialog`, that we need to supply when creating an isntance of the Bot later.
- After making sure that we get these properties, we initialize the private variables with the values we got in. 

```typescript
private conversationState: BotState;
private userState: BotState;
private dialog: Dialog;
private dialogState: StatePropertyAccessor<DialogState>;
/**
  *
  * @param {ConversationState} conversationState
  * @param {UserState} userState
  * @param {Dialog} dialog
  */
constructor(
  conversationState: BotState,
  userState: BotState,
  dialog: Dialog
) {
  super();
  if (!conversationState) {
      throw new Error('[SimonBot]: Missing parameter. conversationState is required');
  }
  if (!userState) {
      throw new Error('[SimonBot]: Missing parameter. userState is required');
  }
  if (!dialog) {
      throw new Error('[SimonBot]: Missing parameter. dialog is required');
  }
  this.conversationState = conversationState as ConversationState;
  this.userState = userState as UserState;
  this.dialog = dialog;
  this.dialogState = this.conversationState.createProperty<DialogState>('DialogState');
  ...
  
  ```

### Method changes
The `onMessage` method will now run the `MainDialog` with the current `context` and `dialogState`. Before it just sent back a message to the user echoing what was written to the Bot.

```typescript
this.onMessage(async (context, next) => {

  // Run the Dialog with the new message Activity.
  await (this.dialog as MainDialog).run(context, this.dialogState);

  // By calling next() you ensure that the next BotHandler is run.
  await next();
  });
```

We have added the `onDialog` method to save changes in state.
```typescript
this.onDialog(async (context, next) => {
  // Save any state changes. The load happened during the execution of the Dialog.
  await this.conversationState.saveChanges(context, false);
  await this.userState.saveChanges(context, false);

  // By calling next() you ensure that the next BotHandler is run.
  await next();
});
```
The `onMembersAdded` have been just slightly changed
```typescript
this.onMembersAdded(async (context, next) => {
  const membersAdded = context.activity.membersAdded;
  for (const member of membersAdded) {
    if (member.id !== context.activity.recipient.id) {
      const welcome = `Welcome to Simon Bot ${ member.name }. This Bot is a work in progress. At this time we have some dialogs working. Type anything to get started.`;
      await context.sendActivity(welcome);
    }
  }
  // By calling next() you ensure that the next BotHandler is run.
  await next();
});
```

## Index.ts

### Imports
Here we also used to have a single import from `botbuilder` and now we have a couple more imports from. We have also imported the `MainDialog` that we we will use and inject in the Bot class instance. 

```typescript
import { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } from 'botbuilder';
import { MainDialog } from './dialogs/mainDialog';
import { SimonBot } from './bots/bot';	
```

### Code changes
in `adapter.onTurnError` at the end of the method we have added some code to delete the conversationState on error.
```typescript
await conversationState.delete(context);
```

- First we set up the required instances of `ConversationState` and `UserState`
- The we initialize an instance of the `MainDialog`
- And finally create a new Bot instace with the required properties.

```typescript
let conversationState: ConversationState;
let userState: UserState;

const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

const dialog = new MainDialog('mainDialog');
const myBot = new SimonBot(conversationState, userState, dialog);
```
## mainDialog.ts
The main dialog consists of two steps `initialStep` and `finalStep`. That will kick off the `siteDialog` and then collect the result.

At first we add some constants, basicly the name of the dialogs we will add.
```typescript
const SITE_DIALOG = 'siteDialog';
const MAIN_WATERFALL_DIALOG = 'waterfallDialog';
```
Then later we use them in the constructor while adding the dialogs we want.

```typescript
constructor(id: string) {
    super(id);

    this.addDialog(new SiteDialog(SITE_DIALOG))
        .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]));

    this.initialDialogId = MAIN_WATERFALL_DIALOG;
  }
}  
```
First we add the dialogs we will use, there's the `SiteDialog` and a `WaterFallDialog`. The Waterfall Dialog contain steps, and these have been added in the sequence which they are intened to be run. 

### initialStep
This step creates a new instance of the `SiteDetails` class and injects it whil starting the `siteDialog` child dialog.
```typescript
private async initialStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const siteDetails = new SiteDetails();
    return await stepContext.beginDialog('siteDialog', siteDetails);
}
```

### finalStep
In this step we collect the result from the previous step, in is this case it's the result from all the `siteDialog` steps. This is where we would typically save something to a "datebase".
```typescript
private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    if (stepContext.result) {
        const result = stepContext.result as SiteDetails;
        const msg = `I have created a ${ JSON.stringify(result) }`;
        await stepContext.context.sendActivity(msg);
    }
    return await stepContext.endDialog();
}
```


## siteDialog.ts
The site dialog consists of multiple `prompts`, the `OwnerResolverDialog` and another `WaterFallDialog`.

This is what the constructor looks like:
```typescript
constructor(id: string) {
    super(id || 'siteDialog');
    this
        .addDialog(new ChoicePrompt(CHOICE_PROMPT))
        .addDialog(new TextPrompt(TITLE_PROMPT, this.titlePromptValidator))
        .addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(new OwnerResolverDialog(OWNER_RESOLVER_DIALOG))
        .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
        .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.siteTypeStep.bind(this),
            this.titleStep.bind(this),
            this.descriptionStep.bind(this),
            this.ownerStep.bind(this),
            this.aliasStep.bind(this),
            this.confirmStep.bind(this),
            this.finalStep.bind(this)
        ]));
    this.initialDialogId = WATERFALL_DIALOG;
}   
```

### SiteTypeStep
The first `siteTypeStep` will use a `ChoicePrompt`. 
We will use the `WaterFallStepContext` to populate `siteDetails` with values in every step. And if we don't have a siteType value in siteDetails, we will prompt the user. In this case we use the dialog/prompt we added using the `CHOICE_PROMPT`. And if we have a value, we will just run `.next(siteDetails.siteType)` and send the value to the next step in the WaterFall Dialog.

```typescript
private async siteTypeStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
  const siteDetails = stepContext.options as SiteDetails;

  if (!siteDetails.siteType) {

      return await stepContext.prompt(CHOICE_PROMPT, {
          choices: ChoiceFactory.toChoices(['Team Site', 'Communication Site']),
          prompt: 'Select site type.'
      });

  } else {
      return await stepContext.next(siteDetails.siteType);
  }
}
```
### TitleStep
The second step `siteTitleStep` will use a `TextPrompt`, but we will prompt the user using the `TITLE_PROMPT`. This prompt was added with a validation method also included.
```typescript 
.addDialog(new TextPrompt(TITLE_PROMPT, this.titlePromptValidator))
```
The validator method will in this case just check that the legth of the text from the user is more than 0 and less than 20 characters. The downside of adding validation methods in the dialog is that it could possibly clutter it a bit, we will look at another example using another dialog soon.

```typescript
private async titlePromptValidator(promptContext: PromptValidatorContext<string>): Promise<boolean> {
  return promptContext.recognized.succeeded && promptContext.recognized.value.length > 0 && promptContext.recognized.value.length < 20;
}

```

We will first get the `siteType` value from the previous step. 
And as in the previous step if we don't have the value from the user, we will prompt the user. And if we have a value, we will just run `.next(siteDetails.title)` and send the value to the next step in the WaterFall Dialog.

```typescript
private async titleStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
  const siteDetails = stepContext.options as SiteDetails;

  siteDetails.siteType = stepContext.result;

  if (!siteDetails.title) {

      const promptText = 'Provide a title for your site';
      const retryPromptText = 'The site title must contain at least one letter and be less than 20';
      return await stepContext.prompt(TITLE_PROMPT, { prompt: promptText, retryPrompt: retryPromptText });
  } else {
      return await stepContext.next(siteDetails.title);
  }
}
```
### OwnerStep
The `ownerStep` will not use any of the prompts we added. It will instead kick off the `OwnerResolverDialog`.

```typescript
private async ownerStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
  const siteDetails = stepContext.options as SiteDetails;

  // Capture the results of the previous step
  siteDetails.description = stepContext.result;

  if (!siteDetails.owner) {
      return await stepContext.beginDialog(OWNER_RESOLVER_DIALOG, { siteDetails });
  } else {
      return await stepContext.next(siteDetails.owner);
  }
}
```

## OwnerResolverDialog
Basicly I have created a dialog similar to the `MainDialog` only a bit smaller.

We also add a `prompt` here and a `WaterFallDialog`, but only two steps - an initial and final step.

```typescript
this
  .addDialog(
    new TextPrompt(TEXT_PROMPT, OwnerResolverDialog.ownerPromptValidator.bind(this))
  ).addDialog(
    new WaterfallDialog(WATERFALL_DIALOG, [
      this.initialStep.bind(this),
      this.finalStep.bind(this)
  ]));

this.initialDialogId = WATERFALL_DIALOG;
}
```
Here we do in a similar fashion that we have supplied a validation method to the text prompt, but in this case it exists in this dialog and does not clutter the `MainDialog`, and sometimes we need multiple validation methods. We will in another post add some extra validation here using `Microsoft Graph` to see that the user actually exists.

```typescript
private static async ownerPromptValidator(promptContext: PromptValidatorContext<string>): Promise<boolean> {
  if (promptContext.recognized.succeeded) {
    const owner: string = promptContext.recognized.value;
    // Regex for email
    if (!OwnerResolverDialog.validateEmail(owner)) {
      promptContext.context.sendActivity('Malformatted email adress.');
      return false;
    } else {
      return true;
    }

  } else {
    return false;
  }
}
```
And this is how the steps looks like, they should be familiar. Note that we don't use a `repromtMessage` since we handle the message to the user in the validator method.
```typescript
private async initialStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
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

private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
  const owner = stepContext.result;
  return await stepContext.endDialog(owner);
}
```