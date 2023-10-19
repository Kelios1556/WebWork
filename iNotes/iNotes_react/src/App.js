import './App.css';
import $ from 'jquery';
import React from 'react';

function noteSort(noteA, noteB) {
    noteA = noteA["lastsavedtime"];
    noteB = noteB["lastsavedtime"];

    var momentA = noteA.slice(0, 8) + " " + noteA.slice(13, 24);
    var momentB = noteB.slice(0, 8) + " " + noteB.slice(13, 24); 
    return new Date(momentB) - new Date(momentA);
}

function NoteListRow(props) {
  var id = props.id;
  var onclick = props.onClick;
  return (
    <div id={id} className="noteListRow" onClick={onclick}>• {props.title}</div>
  );
}

class SignInPage extends React.Component {
  // this.props.handleSignIn={this.handleSignIn}
  constructor(props) {
    super(props);
    this.state = {
      failToLogIn: false
    }
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  handleSignIn(event) {
    event.preventDefault();
    var username = $("#userName").val();
    var userpwd = $("#userPassword").val();
    $.ajax({
            method: 'POST',
            url:'http://localhost:3001/signin',
            dataType: 'JSON',
            data: {userName: username, password: userpwd},
            xhrFields: {withCredentials: true}
    }).done(function(response) {
      if (response["msg"] == undefined) {
        this.setState({failToLogIn: false});
        this.props.handleSignIn(true, response);
      } else {
        this.setState({failToLogIn: true});
      }
    }.bind(this));
  }

  render() {
    var failToLogIn = this.state.failToLogIn;
    return (
      <div id="signInPage">
        {failToLogIn &&
          <div>Login Failure</div>
        }
        <form onSubmit={this.handleSignIn}>
          <label>Username</label> <input type="text" id="userName" name="userName" /><br />
          <label>Password</label> <input type="password" id="userPassword" name="userPassword" /><br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

class SearchBar extends React.Component {
  handleSearchNotes(e) {
    if (e.key == "Enter") {
      var searchstr = e.target.value;
      $.ajax({
              method: 'GET',
              url: "http://localhost:3001/searchnotes?searchstr="+searchstr, 
              xhrFields: {withCredentials: true}
      }).done(function(result) {
        this.props.handleSearchNotes(searchstr, result);
      }.bind(this));
    }
  }

  render() {
    return (
      <div id='searchBar' >
        <label>⚲search</label> <input type="text" onKeyUp={(e) => this.handleSearchNotes(e)} />
      </div>
    );
  }
}

class NoteList extends React.Component { 
  // this.props.notes={notes} 
  // this.props.handleNoteSelected={this.handleNoteSelected}
  // this.props.handleSearchNotes={this.handleSearchNotes}
  constructor(props) {
    super(props);
    this.handleSearchNotes = this.handleSearchNotes.bind(this);
  }

  handleSearchNotes(searchstr, result) {
    this.props.handleSearchNotes(searchstr, result);
  }

  handleNoteSelected(e) {
    var noteid = e.target.id;
    $.ajax({
            method: 'GET',
            url: "http://localhost:3001/getnote?noteid="+noteid,
    }).done(function(result) {
      this.props.handleNoteSelected(result);
    }.bind(this));
  }

  render() {
    const numOfNotes = this.props.notes.length;
    var notes = this.props.notes;
    return(
      <div id="NoteList">
        <SearchBar handleSearchNotes={this.handleSearchNotes}/>
        <div>Notes ({numOfNotes})</div>
        <div>
          {
            notes.map((note, index) => (
              <NoteListRow 
                key={index}
                title={note["title"]}
                id={note["_id"].toString()} 
                onClick={(e)=>this.handleNoteSelected(e)} 
              />
            ))
          }
        </div>
      </div>
    );
  }
}

class NoteDetail extends React.Component { 
  // this.props.note
  // this.props.handleSaveMode
  // this.props.handleDeleteNode
  // this.props.changeEditMode
  // this.props.handleAddNote
  constructor(props) {
    super(props);

    this.state = {
      adding: false
    }
    
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.changeToEdittingMode = this.changeToEdittingMode.bind(this);
    this.cancelFromEdittingMode = this.cancelFromEdittingMode.bind(this);
    this.saveAndQuitEdittingMode = this.saveAndQuitEdittingMode.bind(this);
    this.addNote = this.addNote.bind(this);
    this.changeEditMode = this.changeEditMode.bind(this);
  }

  handleDeleteNote() {
    var ans = window.confirm("Confirm to delete this note?");
    if (ans) {
      var note = this.props.note;
      var id = note["_id"].toString();
      $.ajax({
              method: 'DELETE',
              url: "http://localhost:3001/deletenote/" + id
      }).done(function(result) {
        if (result == '') {
          this.props.handleDeleteNote(id);
        }
      }.bind(this));
    }
  }

  changeEditMode(editting) {
    this.props.changeEditMode(editting);
  }

  changeToEdittingMode() {
    this.changeEditMode(true);
  }

  cancelFromEdittingMode() {
    var ans = window.confirm("Are you sure to quit editing the note?");
    if (ans) {
      this.setState({adding: false});
      this.changeEditMode(false);
    }
  }

  saveAndQuitEdittingMode() {
    var title = document.getElementById("NoteDetail").querySelector("#noteTitle").value;
    var content = document.getElementById("NoteDetail").querySelector("#noteContent").value;
    if (!this.state.adding) {
      var originNote = this.props.note;
      var id = originNote["_id"].toString();
      $.ajax({
              method: 'PUT',
              url: "http://localhost:3001/savenote/" + id,
              dataType: 'JSON',
              data: {title: title, content: content}
      }).done(function(result) {
        originNote["lastsavedtime"] = result["lastsavedtime"];
        originNote["title"] = title;
        originNote["content"] = content;
        var newNote = originNote;
        this.props.handleSaveMode(newNote);
        this.changeEditMode(false);
        this.setState({adding: false});
      }.bind(this));
    } else {
      $.ajax({
        method: 'POST',
        url: " http://localhost:3001/addnote",
        dataType: 'JSON',
        data: {title: title, content: content},
        xhrFields: {withCredentials: true}
      }).done(function(result) {
        this.props.handleAddNote({
          title: title,
          lastsavedtime: result["lastsavedtime"],
          _id: result["_id"].toString()
        },{
          title: title,
          lastsavedtime: result["lastsavedtime"],
          _id: result["_id"].toString(),
          content: content 
        });
      }.bind(this));
    }
    this.changeEditMode(false);
    this.setState({adding: false});
  }

  addNote() {
    this.changeEditMode(true);
    this.setState({adding: true});
  }

  render() {
    var note = this.props.note;
    if (this.state.adding) {
      note = {};
    }
    return (
      <div id="NoteDetail">
        {note !== null && 
          <div>
            {!this.props.editting ? (
              <div>
                <div id="lastSavedTime">Last saved: {note["lastsavedtime"]}</div>
                <button id="ope1" onClick={this.handleDeleteNote}>Delete</button>
              </div>
            ) : (
              <div id="edittingMode">
                <button id="ope1" onClick={this.cancelFromEdittingMode}>Cancel</button>
                <button id="ope2" onClick={this.saveAndQuitEdittingMode}>Save</button>
              </div>
            )
            }
            {this.state.adding ? (
              <div>
                <br /><textarea id="noteTitle" onClick={this.changeToEdittingMode} defaultValue="Note title"></textarea>
                <br /><textarea id="noteContent" onClick={this.changeToEdittingMode} defaultValue="Note content"></textarea> 
              </div>
            ) : (
              <div>
                <br /><textarea id="noteTitle" onClick={this.changeToEdittingMode} key={note["_id"]} defaultValue={note["title"]}></textarea>
                <br /><textarea id="noteContent" onClick={this.changeToEdittingMode} key={note["_id"]+"content"} defaultValue={note["content"]}></textarea>
              </div>
            )}
          </div>
        }
        <button id="newNote" onClick={this.addNote}>new note</button>
      </div>
    )
  }
}


class LoggedInMessage extends React.Component {
  //this.props.name={this.state.userName} 
  //this.props.icon={this.state.userIcon} 
  //this.props.handleSignOut={this.handleSignOut}
  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut() {
    var flag = true;
    if (this.props.editting) {
      var ans = window.confirm("Are you sure to quit editing the note and log out?");
      if (!ans) {
        flag = false;
      }
    }
    if (flag) {
      $.ajax({
              method: 'GET',
              url: "http://localhost:3001/logout",
              xhrFields: {withCredentials: true}
      }).done(function() {
        this.props.handleSignOut(true);
      }.bind(this));
    }
  }

  render() {
    var iconUrl = this.props.icon;
    var name = this.props.name;
    return (
      <div id="LoggedInMessage">
        <img id="icon" alt={name+"'s icon"} src={iconUrl} width="64" height="64" />
        <div id="name">{name}</div>
        <input className="submit" type="submit" value="log out" onClick={this.handleSignOut} />
      </div>
    );
  }
}

class INoteApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoggedIn: false,
        userName: '',
        userIcon: '',
        notes: null, // _id, lastsavedtime, title
        selectedNote: null, // _id, lastsavedtime, title, content
        editting: false, // true if in editting mode
        searchstr: '' // the last searchstr
      };

      this.handleSignIn = this.handleSignIn.bind(this);
      this.handleSignOut = this.handleSignOut.bind(this);
      this.handleNoteSelected = this.handleNoteSelected.bind(this);
      this.handleSaveMode = this.handleSaveMode.bind(this);
      this.handleDeleteNote = this.handleDeleteNote.bind(this);
      this.handleAddNote = this.handleAddNote.bind(this);
      this.componentDidUpdate = this.componentDidUpdate.bind(this);
      this.handleSearchNotes = this.handleSearchNotes.bind(this);
      this.changeEditMode = this.changeEditMode.bind(this);
    }

    componentDidUpdate() {
      if (this.state.isLoggedIn && this.state.selectedNote !== null) {
        var noteListrows = document.getElementById("NoteList").querySelectorAll(".noteListRow");
        for (let i of noteListrows) {
          i.classList.remove("selected");
        }
        var noteid = this.state.selectedNote["_id"];
        var selectedNote = document.getElementById("NoteList").querySelector("[id='"+noteid+"']");
        if (selectedNote !== null) {
          selectedNote.classList.add("selected");
        }
      }
    }

    handleSignIn(success, records) {
      records["notes"] = records["notes"].sort(noteSort);
      if (success) {
        this.setState({
          isLoggedIn: true,
          userName: records["name"],
          userIcon: records["icon"],
          notes: records["notes"], 
        });
      }
    }

    handleSignOut(success) {
      if (success) {
        this.setState({
          isLoggedIn: false,
          userName: '',
          userIcon: '',
          notes: null,
          selectedNote: null,
          editting: false
        });
      }
    }

    handleNoteSelected(note) {
      var noteid = note["_id"].toString();
      var noteListrows = document.getElementById("NoteList").querySelectorAll(".noteListRow");
      for (let i of noteListrows) {
        i.classList.remove("selected");
      }
      var selectedNote = document.getElementById("NoteList").querySelector("[id='"+noteid+"']");
      selectedNote.classList.add("selected");
      this.setState({selectedNote: note});
    }

    handleSaveMode(newNote) {
      var originNotes = this.state.notes;
      var newNotes = [];
      var exists = false;
      for (let i of originNotes) {
        if (i["_id"] == newNote["_id"]) {
          exists = true;
        }
      }
      if (!exists) {
        originNotes.push(newNote);
      }
      if (newNote["title"].includes(this.state.searchstr) || newNote["content"].includes(this.state.searchstr)) {
        newNotes = originNotes.map(note => note["_id"] == newNote["_id"] ? newNote : note);
      } else {
        newNotes = originNotes.filter(note => note["_id"] !== newNote["_id"]); 
      }

      newNotes = newNotes.sort(noteSort);

      this.setState({
        notes: newNotes,
        selectedNote: newNote
      });
    }

    handleDeleteNote(id) {
      var originNotes = this.state.notes;
      var newNotes = originNotes.filter(note => note["_id"] !== id);
      newNotes = newNotes.sort(noteSort);
      this.setState({
        notes: newNotes,
        selectedNote: null
      });
      var selectedNote = document.getElementById("NoteList").querySelector("[id='"+id+"']");
      if (selectedNote !== null) {
        selectedNote.classList.remove("selected");
      }
    }

    handleAddNote(newNote, newNoteForSelected) {
      var newnotes = this.state.notes;
      newnotes.push(newNote);
      newnotes = newnotes.sort(noteSort)
      this.setState({
        notes: newnotes,
        selectedNote: newNoteForSelected
      });
    }

    handleSearchNotes(searchstr, filteredNotesList) {
      if (filteredNotesList !== null) {
        filteredNotesList = filteredNotesList.sort(noteSort);
      }
      this.setState({
        searchstr: searchstr,
        notes: filteredNotesList
      });
    }

    changeEditMode(editting) {
      var noteTitle = document.getElementById("NoteDetail").querySelector("#noteTitle");
      var noteContent = document.getElementById("NoteDetail").querySelector("#noteContent");
      if (noteTitle !== null) {
        noteTitle.value = this.state.selectedNote["title"];
      }
      if (noteContent !== null) {
        noteContent.value = this.state.selectedNote["content"];
      }
      this.setState({
        editting: editting
      });
    }

    render() {
      const isLoggedIn = this.state.isLoggedIn;
      var notes = this.state.notes;
      var note = this.state.selectedNote;
      return (
        <div id="INoteApp">
            <meta name="viewport" content="width=device-width,initial-scale=1.0" />
            <h1>iNotes</h1>    
            { isLoggedIn ? (
              <div>
                <LoggedInMessage 
                  name={this.state.userName} 
                  icon={this.state.userIcon} 
                  editting={this.state.editting}
                  handleSignOut={this.handleSignOut} 
                />
                <div id="notePage">
                <NoteList 
                  notes={notes} 
                  newSelectedNote={note} 
                  handleNoteSelected={this.handleNoteSelected}
                  handleSearchNotes={this.handleSearchNotes}
                />
                <NoteDetail
                  editting={this.state.editting}
                  changeEditMode={this.changeEditMode} 
                  note={note} 
                  handleAddNote={this.handleAddNote} 
                  handleSaveMode={this.handleSaveMode} 
                  handleDeleteNote={this.handleDeleteNote}
                />
                </div>
              </div>
            ) : (
              <SignInPage handleSignIn={this.handleSignIn} />
            )
            }
        </div>
      );
    }
};

export default INoteApp;
