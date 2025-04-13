document.addEventListener("DOMContentLoaded", function() {
    const nameInput = document.getElementById("commenter-name");
    const commentInput = document.getElementById("comment-text");
    const commentButton = document.getElementById("comment-btn");
    const commentForm = document.getElementById("commentForm");

    const goalSection = document.querySelector("#my_goals");
    const commentsHeading = goalSection.querySelector("h2:nth-of-type(2)");

    const sortControls = document.createElement("div");
    sortControls.className = "sort-controls";
    sortControls.innerHTML = `
    <span>Sort by: </span>
    <button id="sort-newest" class="active">Newest First</button>
    <button id="sort-oldest">Oldest First</button>
    `;

    commentsHeading.after(sortControls);

    const commentsContainer = document.createElement("div");
    commentsContainer.id = "comments-container";
    
    //I fix date for existing comments March 19, 2025, 5:00 PM
    const fixedDate = new Date(2025, 2, 19, 17, 0, 0); 
    const fixedTimestamp = fixedDate.getTime();

    const existingComments = [];
    let currentElement = commentsHeading.nextElementSibling.nextElementSibling;
    
    while (currentElement && currentElement.tagName === "P" && 
        currentElement.textContent.includes("-")) {
    const commentText = currentElement.textContent;
    const tempElement = currentElement;
    currentElement = currentElement.nextElementSibling;

    existingComments.push({
        text: commentText,
        timestamp: fixedTimestamp,
        element: tempElement
    });

    tempElement.remove();
    }

    sortControls.after(commentsContainer);

    existingComments.forEach(comment => {
    const commentElement = comment.element;
    const formattedDate = fixedDate.toLocaleString("en-US", {
        year: "numeric", 
        month: "short", 
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

    commentElement.textContent = `${comment.text} (${formattedDate})`;
    commentElement.dataset.timestamp = comment.timestamp;
    commentElement.dataset.formattedDate = formattedDate;

    commentsContainer.appendChild(commentElement);
    });
    
    function toggleButton() {
    commentButton.disabled = !(nameInput.value.trim() 
        && commentInput.value.trim());
    }
    
    nameInput.addEventListener("input", toggleButton);
    commentInput.addEventListener("input", toggleButton);

    commentForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const timestamp = new Date().getTime();
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric", hour: "numeric",
        minute: "2-digit", hour12: true
    });

    const newComment = document.createElement("p");
    newComment.textContent = `${nameInput.value}: ${commentInput.value} 
        (${formattedDate})`;
    newComment.dataset.timestamp = timestamp;
    newComment.dataset.formattedDate = formattedDate;

    commentsContainer.prepend(newComment);

    nameInput.value = "";
    commentInput.value = "";
    commentButton.disabled = true;
    
    commentsContainer.classList.remove("empty");
    });

    document.getElementById("sort-newest").addEventListener("click", function(){
    document.getElementById("sort-newest").classList.add("active");
    document.getElementById("sort-oldest").classList.remove("active");
    sortComments("desc");
    });
    
    document.getElementById("sort-oldest").addEventListener("click", function(){
    document.getElementById("sort-oldest").classList.add("active");
    document.getElementById("sort-newest").classList.remove("active");
    sortComments("asc");
    });
    
    if (commentsContainer.children.length === 0) {
    commentsContainer.classList.add("empty");
    }
    
    sortComments("desc");
});

function sortComments(direction) {
    const commentsContainer = document.getElementById("comments-container");
    const comments = Array.from(commentsContainer.children);
    
    comments.sort((a, b) => {
    const timestampA = parseInt(a.dataset.timestamp);
    const timestampB = parseInt(b.dataset.timestamp);

    if (direction === "asc") {
        return timestampA - timestampB;
    } else {
        return timestampB - timestampA; 
    }
    });

    commentsContainer.innerHTML = "";
    comments.forEach(comment => {
    commentsContainer.appendChild(comment);
    });
}