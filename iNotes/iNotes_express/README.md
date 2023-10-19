# iNoteApp

## NoteService

### app.js
* set cors

* use the database named `assignment2`

* set session

* `app.use(cors({credentials: true, origin: 'http://localhost:3000'}));`: to send `withCredential` boolean true in ajax

* etc.

### notes.js
* `function getDate()`: this function serves to extract the current date and time from `new Date()` object and format it into the required format, used when saving a note, adding a note, etc.
  * An example of the final format: 10:02:20 Nov 18 2022

* `router....`: implemented according to the handout

## noteapp

### index.js
inplemented according to the handout

### App.js
* `function noteSort()`: This function serves as the function used in the Array.sort() to sort the notes in the left pane in **reverse chronological order** of the last saved time of the notes. This is done by extracting the `hh:mm:ss` and the `MMM dd yyyy` from the `lastsavedtime` and feeding the combination into `Date()` to generate a Date Object, which is then used for comparison.

* `function NoteListRow()`: This function returns the `div` element with each note's title, which will be displayed in the left pane.

* `class SignInPage`: This implements the page upon opening iNoteApp (i.e., the page to be shown before login and after logout).
  * `handleSignIn()`: triggered when user intended to **log in**

* `class SearchBar`: This implements the search bar in the left pane.
  * `handleSearchNotes()`: triggered when user intended to **search notes**

* `class NoteList`: This implements the **left** pane.
  * `handleSearchNotes()`: triggered when user intended to search notes, by `handleSearchNotes()` in `SearchBar`
  * `handleNoteSelected()`: triggered when user clicked a certain note listed in the left pane

* `class NoteDetail()`: This implements the **right** pane
  * `handleDeleteNote`: triggered when user click `delete` button
  * `changeEditMode`: exit or enter into editting mode
  * `changeToEdittingMode`: triggered when user click `new note` button, click into either the title textarea or the content textarea, with the display of `lastsavedtime` and the `delete` button replace by a `save` and a `cancel` button
  * `cancelFromEdittingMode`: triggered when user click `calcel` button
  * `saveAndQUitEdittingMode`: triggered when user click `save` button
  * `addNote`: triggered when user click `new note` and then click `save` after certain edit

* `class LoggedInMessage`: This implements the info that shows above the pane
  * `handleSignOut`: triggered when user click `log out` button

* `class INoteApp`: The whole page
  * `componentDidUpdate`: In this function, the selected note, if appearing in the left pane, will be highlighted, while the others not
  * other functions are triggered by functions in other classes and are implemented to set the state of the class








