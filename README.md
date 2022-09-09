## Technical background
At the time of allocation of this technical round, it was mentioned in the provided documentation that the application needs to be developed using Angular. Being inexperienced at Angular and Typescript, I went through their documentations and got myself familiar with Angular's concepts and Typescript syntaxes with the help of few tutorial apps.

I was later informed about the freedom to switch to a comfortable Javascript framework (React in my case), but since I had already gotten significant work done here, I continued working on this app. Please let me know if I should also submit a similar React app.

## [View app](https://rishii1909.github.io/dotproduct-demo/)
You can view app at [https://rishii1909.github.io/dotproduct-demo](https://rishii1909.github.io/dotproduct-demo/)

## Features

 - Create cards.
 - Edit card contents - title, description, category column.
 - Validate Title and description for cards.
 - Drag and drop to re-order cards, or to move from one category column to another.
 - Delete cards.
 - Create categories.
 - Edit category names/labels.
 - Delete categories.
 - Encrypts and stores users data in local storage.

## Design approach

The given problem statement demands for a Minimum Viable Product that provides a service similar to **Trello**. Trello's Kanban-style approach traditionally uses bulletin boards that allows users to organise their tasks and milestones accordingly. Kanban consists of mainly two components - boards and cards. These constitute of main components around which we need to build the app.

Explaining different parts of the codebase :
Note: Column or Category refer to the same entity.

Interfaces - 

 1. Card - Lowermost item in hierarchy, represents a Card object that's visible and used by users.
		
| Field | Description |
|--|--|
|  title|Title of this card  |
|  description|Description of this card  |
|  tag|tags on this card (future scope)  |

 2. Column/Category - Represents a category containing one or many cards - 

| Field | Description |
|--|--|
|  key|Label of this card  |
|  children|Array of Cards present in this Category  |

 3. Grid - At the top of hierarchy, holds an array of of all Categories and represents a 2D-array of all cards.


## Services

Since it has been mentioned that the boards and their respective cards need to be persistent, a good, scalable, and secure approach to this would've been storing JSON data of the current board state in a database. However, it has also been mentioned that this app needs to be demonstrated using a static hosting, I have stored all the data in client's local storage.

Utility functions have been created in [src/app/app.component.ts] as follows to ease this :

 1. **`fetchStore() ...line 39`** - Returns client's decrypted last saved state if found in local storage, or else returns the default placeholder state defined in default_state(more on this below).
 2. **`saveDataToLocal() ..line 62`** - Encrypts and stores user's data using the secret key.

To facilitate the transfer of information between a source node and destination node in the grid, some more helper functions have been created.

For Card contents. :

 1. **`handleTitleChange(event) ...line 72`** - Changes the title value for a particular card to event's target value.
 2. **`handleDescriptionChange(event) ...line 97`** - Changes the description value for a particular card to event's target value;
 3. **`handleCategoryChange(prevCol:number, prevRow:number, event:any, modal:any) ...line 140`** - Changes grid co-ordinates of a card from [prevCol, prevRow] to [event's target value, prevRow] and updates active modal as required.

For Cards :

 1. **`addCard(i:number) ...line 160`**  - Takes a parameter index 'i', that denotes the category column to which a card needs to be added. A new default card is pushed to the cards array of this column, and modal is opened to enter content.
 2. **`deleteCard(i:number, j:number, modal:any) ...line 188`** - Takes parameters :
	 1. index i : Index of category column to delete from.
	 2. index j : Index of card to delete.
	 3. modal : reference to the modal HTMLObject open in browser from where the function call was triggered via delete button call. Required to close the modal after deleting the card.

For Categories : 

 1. **`addCategory() ...line 160`** - Appends a new category column to the end of the grid.
 2. **`deleteCategory(index:number) ...line 169`** - Deletes the category column present at given index.
 3. **`getCategories() ...line 124`** - Returns a list of all available categories to choose from.
 4. **`handleColumnKeyChange(index:number, event:any) ...line 118`** - Change the key(label) for category column present at given index to event's target value.

For Modal : 

 1. **`show(a:number, b:number) ...line 198`** - Show's the edit card modal for a card present in grid at [a, b], set active_modal values to [a, b] to enable any content updates for current card.
 2. **`hide() ...line 204`** - Hides the active modal.

## Validations

Handled by `handleTitleChange()` and `handleDescriptionChange()`.
 
## Questions that might arise

 - **How is Drag and Drop implemented?** --- Drag and drop has been implemented using the [ng2-dracula](https://www.npmjs.com/package/ng2-dragula) package.

 - **Why is the secret key for encryption/decryption hard-coded? Why not use an environment variable, it's secure.** --- I felt that static hosts like Github pages probably will not allow me to declare and utilise environment variables.

 - **Why not create a separate utilities file for all the utility functions listed under services for each component, or a separate card component to use in template?** --- Typically in React, the first logical thing I would do is segregate and organise every bit of code I can. Angular isn't my forte, I was nervous while developing the app. Having all necessary bits together right there in the `app.component.ts and app.component.html` file help me feel at ease during the process. Will be much more organised from next time : )

## Thank you!
Looking forward to hearing from you soon!

