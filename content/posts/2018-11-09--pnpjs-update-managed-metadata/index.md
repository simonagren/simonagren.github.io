---
title: Update managed metadata fields with PnPJs 
tags: ["sharepoint", "pnp"]
cover: pnp-pnpjs-600.png
author: Simon Ågren
---

![](./pnp-pnpjs-600.png)

Last night I was helping out with an issue in the PnPJs repository on GitHub where the user wanted to update a managed metadata column. I really love PnPJs because it makes difficult rest calls really simple and intuitive to execute. The user was still hoping for a more simple solution than what I provided - and I don't blame him.


So I made a few methods where the user can send in a term och terms, directly from the termset. So we will be able to update both multi and single valued managed metadata columns quite easily.

### Updating a single valued 
Here we send in a term (with types from PnPJs), the list name, the field name, and the Id of the item we wish to update.

We are using `-1` as `WssId` and that's fine, it will sort it self automatically. After setting up the data object we use PnPJs to update the item, and return the updated item data.

```typescript
public async updateMeta(term: (ITerm & ITermData), listName: string, fieldName: string, itemId: number): Promise<any> {
    const data = {};
    data[fieldName] = {
      "__metadata": { "type": "SP.Taxonomy.TaxonomyFieldValue" },
      "Label": term.Name,
      'TermGuid': this.cleanGuid(term.Id), // field guid
      'WssId': '-1' // fake
    };

    return await sp.web.lists.getByTitle(listName).items.getById(itemId).update(data);

  }
```

### Updating a multi valued 
Here we send in multiple terms (with types from PnPJs), the list name, the field name, and the Id of the item we wish to update.

Here are we concatinating all the values in to one single string. Here we are also using `-1` as `WssId`, the name and the Id of the Term. 

We do an additional call to get the hidden field that's related to the metadata field, then we use the internalname in the data object.

Then we update the item with PnPJs in the same way as before. The real difference is just the data object in these cases.

```typescript
public async updateMultiMeta(terms: (ITerm & ITermData)[], listName: string, fieldName: string, itemId: number): Promise<any> {
    const data = {};

    const list = await sp.web.lists.getByTitle(listName);
    const field = await list.fields.getByTitle(`${fieldName}_0`).get();

    let termsString: string = '';
    terms.forEach(term => {
      termsString += `-1;#${term.Name}|${this.cleanGuid(term.Id)};#`;
    })

    data[field.InternalName] = termsString;

    return await list.items.getById(itemId).update(data);

}
  ```


### The full code
This is not being used in production, you might have to tweak the code to some extent.


```typescript
import { sp } from "@pnp/sp";
import { taxonomy, ITerm, ITermData } from "@pnp/sp-taxonomy";

public async doStuff(): Promise<void> {

    // Using taxonomy to get term set
    const store = await taxonomy.getDefaultSiteCollectionTermStore();
    const termset = await store.getTermSetById("10e3b8d1-edef-48ce-82f4-d184c5cd49b2");
    
    // get a single term
    const term = await termset.terms.getByName("Term2").get();

    // get all terms in termset
    const terms = await termset.terms.get();

    // Update single valued taxonomy field and log updated item
    console.log(await this.updateMeta(term, 'ListName', 'Meta', 1));
    
    // Update multi valued taxonomy field and log updated item
    console.log(await this.updateMultiMeta(terms, 'ListName', 'MultiMeta', 1));

  }

public cleanGuid(guid: string): string {
    if (guid !== undefined) {
        return guid.replace('/Guid(', '').replace('/', '').replace(')', '');
    } else {
        return '';
    }
}

public async updateMeta(term: (ITerm & ITermData), list: string, field: string, itemId: number): Promise<any> {
    const data = {};
    data[field] = {
      "__metadata": { "type": "SP.Taxonomy.TaxonomyFieldValue" },
      "Label": term.Name,
      'TermGuid': this.cleanGuid(term.Id),
      'WssId': '-1'
    };

    return await sp.web.lists.getByTitle(list).items.getById(itemId).update(data);

  }

  public async updateMultiMeta(terms: (ITerm & ITermData)[], listName: string, fieldName: string, itemId: number): Promise<any> {
    const data = {};

    const list = await sp.web.lists.getByTitle(listName);
    const field = await list.fields.getByTitle(`${fieldName}_0`).get();

    let termsString: string = '';
    terms.forEach(term => {
      termsString += `-1;#${term.Name}|${this.cleanGuid(term.Id)};#`;
    })

    data[field.InternalName] = termsString;

    return await list.items.getById(itemId).update(data);

  }
  ```