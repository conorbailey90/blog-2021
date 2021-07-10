let db = firebase.firestore()
const postSection = document.querySelector('.post-section')
const menuTog = document.querySelector('.menu-tog');
const closeTog = document.querySelector('.close-tog');
const menu = document.querySelector('.menu');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentList = document.querySelector('.comment-list');

let blogPosts;

menuTog.addEventListener('click', () => {
    menu.classList.add('active');
});

closeTog.addEventListener('click', () => {
    menu.classList.remove('active');
});

// Get post ID from address to pull relevant post from database.
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams.get('id'));

var docRef = db.collection("posts").doc(urlParams.get('id'));

let commentsArr = [];
let commentsRef = db.collection("comments");

// Get comments related to the post.
let comments = commentsRef.where("docID", "==", urlParams.get('id'))
.orderBy('timeStamp', 'desc').get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        commentsArr.push(doc.data())
        appendComments()
    });
})
.catch((error) => {
    console.log("Error getting comments: ", error);
});
;

docRef.get().then((doc) => {
    if (doc.exists) {
        let data = doc.data();
        // console.log("Document data:", doc.data());
        // destructure the data object
        let {title, content, video}  = data;
 
        // Change the title of the webpage.
        document.title = title;

        let titleDiv = document.createElement('div');
        titleDiv.innerText = `${title}`;

        let postContainer = document.createElement('div');
        postContainer.classList.add('post-container');

        let contentDiv = document.createElement('div');
        contentDiv.innerText = `${content}`;
        postContainer.append(contentDiv);

        let videoFrame = document.createElement('iframe');
        videoFrame.src = video;
        videoFrame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        videoFrame.allowFullscreen = true;
   
        postSection.append(titleDiv, postContainer, videoFrame);
      
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});


// Submit a new comment.
commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = await getUser();
    console.log(user)
    if(!user){
        alert('Please sign in.')
        return;
    }

    db.collection("comments").add({
        timeStamp: firebase.firestore.Timestamp.now(),
        authorId: user.uid, 
        authorName: user.displayName,
        date: new Date().toISOString(),
        docID: urlParams.get('id'),
        body: commentInput.value
    })   
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        commentInput.value = '';
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
})

db.collection("comments").where("docID", "==", urlParams.get('id'))
.orderBy('timeStamp', 'desc')
    .onSnapshot((querySnapshot) => {
        commentsArr = [];
        querySnapshot.forEach(doc => {
            let postComment = {...doc.data(), id: doc.id};
            // console.log(postComment)
            commentsArr.push(postComment);
        });
        appendComments();
    })


function appendComments(){
    commentList.innerHTML = ''
    let user = getUser();
    // console.log(user.uid);
    for(let i = 0; i < commentsArr.length; i++){

        let {id, authorName, authorId, date, body} = commentsArr[i];
        let li = document.createElement('li');
        li.classList.add('post-comment');
        let headerDiv = document.createElement('div');
        headerDiv.classList.add('commment-header');

        let authorDiv = document.createElement('div');
        authorDiv.classList.add('comment-author');
        authorDiv.innerText = authorName;

        let dateDiv = document.createElement('div');
        dateDiv.classList.add(`comment-date-${i}`);
        dateDiv.innerText = date.slice(0, 10);

        headerDiv.append(authorDiv, dateDiv);

        let commentDiv = document.createElement('div');
        commentDiv.classList.add('comment-text');
        commentDiv.innerText = body;

        let deleteDiv = document.createElement('div');
        deleteDiv.innerText = `Delete comment`;
        deleteDiv.classList.add('delete-comment');
        commentDiv.appendChild(deleteDiv);
        deleteDiv.addEventListener('click', () => {
            deleteComment(id, authorId)
        })

        if(user && user.uid == commentsArr[i].authorId){
            let optionsDiv = document.createElement('div');
            optionsDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="#fcc42a" class="mercado-match" width="16" height="16" focusable="false">
                                        <path d="M3 9.5A1.5 1.5 0 114.5 8 1.5 1.5 0 013 9.5zM11.5 8A1.5 1.5 0 1013 6.5 1.5 1.5 0 0011.5 8zm-5 0A1.5 1.5 0 108 6.5 1.5 1.5 0 006.5 8z"></path>
                                    </svg>`;
            optionsDiv.classList.add('comment-options');
            optionsDiv.addEventListener('click', () => {
                let active = optionsDiv.parentElement.nextSibling.children[0].classList.contains('active');
                [...document.querySelectorAll('.delete-comment')].forEach(div => div.classList.remove('active'));
                if(active) return;
                optionsDiv.parentElement.nextSibling.children[0].classList.add('active');
            
            })
            headerDiv.appendChild(optionsDiv)
        }else{
            let paddingDiv = document.createElement('div');
            paddingDiv.style.flex = 1;
            headerDiv.appendChild(paddingDiv);
        }
        li.append(headerDiv, commentDiv);
        commentList.appendChild(li);
    }
}

async function deleteComment(id, authorId){
    let user = getUser();
        if (user) {
            if(user.uid === authorId){
                if(confirm('Are you sure you would like to delete comment?')){
                    db.collection('comments').doc(id).delete().then(() => {
                        console.log("Document successfully deleted!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }
            };
          // ...
        } else {
          alert('Not signed in.')
        }
   
}

function getUser(){
    const user = firebase.auth().currentUser;
        if (user) {
            return user;
        } else {
        // No user is signed in.
        console.log('Not signed in.');
        }
    
}