[] storage listener is added on each render

- related? entire app rerenders every time the time updates
- flow of data was meant to be: update chrome storage > storage
  listener fires set state > app updates
- why not flip it? setState with a updateStorage callback
  function
- app renders > componentDidMount _of each component_ calls
  chrome storage specifying the key it needs
