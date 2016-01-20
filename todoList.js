var data = [];

// props : object state from parent component
// state : object state from current component

// Main component
var TodoBox = React.createClass({
  render: function() {
    return (
      <div>
        <div className="col-md-4"></div>
        <div className="todoBox col-md-4">
          <h1>Todo List</h1>
          <TodoList data={this.props.data} />
        </div>
        <div className="col-md-4"></div>
      </div>
    );
  }
});

// Sub component
var TodoList = React.createClass({
  getInitialState: function() {
    return { 
      data: this.props.data
    };
  },
  handleRemoveClick: function(todo) {
    var items = this.state.data;

    items = items.filter(function(cur) {
      return cur.id != todo.id;
    });

    // remove todo    
    this.setState({data: items}); 
  },
  handleTodoSubmit: function(todo) {
    this.state.data.push(todo);
    // re render component
    this.forceUpdate();
  },
  handleTodoLoad: function(todos) {
    this.setState({data: todos});

    this.forceUpdate();
  },
  render: function() {
    var self = this;
    
    var todoNodes = this.state.data.map(function(todo, i) {
      return (
        <Todo key={todo.id} id={todo.id} content={todo.content} status={todo.status} onTodoRemove={self.handleRemoveClick}></Todo>
      );
    });

    return (
      <div className="todoList">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Content</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todoNodes}
          </tbody>
        </table>
        <TodoForm data={this.state.data} onTodoSubmit={this.handleTodoSubmit} />
        <TodoFormExtra onTodoLoad={this.handleTodoLoad} data={this.state.data} />
      </div>
    );
  }
});

// Todo component
var Todo = React.createClass({
  getInitialState: function() {
    return { 
      id: this.props.id, 
      content: this.props.content, 
      status: this.props.status
    };
  },
  refresh: function() {
    this.setState({
      id: this.state.id,
      content: this.state.content,
      status: this.state.status
    });
  },
  handleContentChange: function(event) {
    this.setState({
      content: event.target.value
    });
  },
  handleStatusChange: function(event) {
    this.setState({
      status: event.target.checked
    });
  },
  handleRemoveButton: function(event) {
    this.props.onTodoRemove(this.state);
  },
  render: function()
  {
    return (
      <tr className="todo">
        <th scope="row">
          {this.state.id}
        </th>
        <th>
          <input 
            className="form-control"
            type="text" 
            value={this.state.content} 
            onChange={this.handleContentChange} />
        </th>
        <th>
          <input 
            checked={this.state.status} 
            type="checkbox" 
            onChange={this.handleStatusChange} />
        </th>
        <th>
          <button
              className="btn btn-warning"
              onClick={this.handleRemoveButton}>
                Remove
          </button>
        </th>
      </tr>
    );
  }
});

var TodoForm = React.createClass({
  getInitialState: function() {
    return { 
      content: '' 
    };
  },
  handleContentChange: function(event) {
    this.setState({
      content: event.target.value
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();

    var todo = { 
      id: this.props.data.length == 0 ? 1 : this.props.data[this.props.data.length - 1].id + 1, 
      content: this.state.content,
      status: false
    };

    // reinit value of input
    this.setState({content: ''});

    // use function from TodoList component
    this.props.onTodoSubmit(todo);
  },
  render: function() {
    return (
      <div className="todoForm">
        <h2>Add a Todo</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="content"
              value={this.state.content}
              onChange={this.handleContentChange} />
          </div>
          <div className="form-group">
            <button 
              type="submit"
              className="form-control btn btn-primary">
                Add
              </button>
          </div>
        </form>
      </div>
    );
  }
});

var TodoFormExtra = React.createClass({
  getInitialState: function() {
    return { 
      data: this.props.data
    };
  },
  handleLoad: function(event) {
    var ltodos = localStorage.getItem("todos");
    if(ltodos == null) {
      alert('Nothing in the localStorage !');
      return;
    }

    this.props.onTodoLoad(JSON.parse(ltodos));
  },
  handleSave: function(event) {
    localStorage.setItem("todos", JSON.stringify(this.state.data));
  },
  handleClear: function(event) {
    localStorage.clear();
  },
  render: function() {
    return (
      <div className="TodoFormExtra">
        <h2>Todos & LocalStorage</h2>
        <div className="form-group">
          <button 
            onClick={this.handleLoad}
            className="form-control btn btn-success">
              Load from LocalStorage
            </button>
          <button 
            onClick={this.handleSave}
            className="form-control btn btn-danger">
              Save in LocalStorage
            </button>
          <button 
            onClick={this.handleClear}
            className="form-control btn btn-warning">
              Clear LocalStorage
            </button>
        </div>
      </div>
    );
  }
});

// Generate
ReactDOM.render(
  <TodoBox data={data} />,
  document.getElementById('content')
);