document.addEventListener("DOMContentLoaded", function() {
  fetchQuotes()
  handleForm()
})

function fetchQuotes() {
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(renderQuotes)
}

function renderQuotes(quotes) {
  quotes.forEach(quote => displayQuote(quote))
}

function displayQuote(quote) {
  let quoteList = document.querySelector("#quote-list")
  let quoteListItem = buildQuote(quote)

  quoteList.appendChild(quoteListItem)
}

function buildQuote(quote) {
  // debugger
  let li = document.createElement('li')
  li.className = 'quote-card'
  li.dataset.id = quote.id 

  let blockquote = document.createElement('blockquote')
  blockquote.className = 'blockquote'

  let p = document.createElement('p')
  p.className = "mb-0"
  p.innerText = quote.quote 

  let footer = document.createElement('footer')
  footer.className = "blockquote-footer"
  footer.innerText = quote.author 

  let br = document.createElement('br')

  let likeButton = document.createElement('button')
  likeButton.className = "btn-success"
  likeButton.innerText = "Likes: "
  likeButton.addEventListener("click", likeQuote)

  let span = document.createElement('span')
  span.innerText = `${quote.likes ? quote.likes.length : 0}`
  
  let deleteButton = document.createElement('button')
  deleteButton.className = "btn-danger"
  deleteButton.innerText = "Delete"
  deleteButton.addEventListener("click", deleteQuote)

  blockquote.appendChild(p)
  blockquote.appendChild(footer)
  blockquote.appendChild(br)
  likeButton.appendChild(span)
  blockquote.appendChild(likeButton)
  blockquote.appendChild(deleteButton)

  li.appendChild(blockquote)

  return li 
}

// Handle the Form 
function handleForm() {
  let quoteForm = document.querySelector("#new-quote-form")
  quoteForm.addEventListener("submit", createNewQuote)
}

function createNewQuote(event) {
  event.preventDefault()

  let quote = {
    quote: event.target.quote.value, 
    author: event.target.author.value 
  }

  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify(quote)
  })
    .then(res => res.json())
    .then(quote => displayQuote(quote))
}

// Delete a quote 
function deleteQuote(quote) {
  let quoteList = document.querySelector("#quote-list")
  let quoteListItem = quote.target.closest("li")
  let quoteId = quote.target.closest("li").dataset.id
  
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(res => {
    quoteList.removeChild(quoteListItem)
  })
}

// Like a quote 
function likeQuote(quote) {
  let quoteListItem = quote.target.closest("li")
  let quoteId = quote.target.closest("li").dataset.id
  quoteId = parseInt(quoteId)

  let like = {
    quoteId: quoteId, 
    createdAt: new Date()
  }
  
  fetch("http://localhost:3000/likes", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify(like)
  })
    .then(res => res.json())
    .then(like => {
      let span = quoteListItem.querySelector("span")
      span.innerText = parseInt(span.innerText) + 1
    })
}
