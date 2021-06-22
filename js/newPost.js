
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
       
        console.log(user)
        if(user.email !== 'conbailey90@gmail.com'){
            alert('Unauthorised');
            window.location.href = 'index.html'
            return;
        }
        document.querySelector('.overlay').style.display = 'none'
        // ...
    } else {
        // User is signed out
        // ...
        alert('please sign in')
        window.location.href = 'index.html'
    }
});


let db = firebase.firestore()
// console.log(db)

const postForm = document.getElementById('post-form')
const postTitle = document.getElementById('post-title');
const postSummary = document.getElementById('post-summary');
const postContent = document.getElementById('post-content');
const videoLink = document.getElementById('video-link');
const imageLink = document.getElementById('image-link');

const menuTog = document.querySelector('.menu-tog');
const closeTog = document.querySelector('.close-tog');
const menu = document.querySelector('.menu');

menuTog.addEventListener('click', () => {
    menu.classList.add('active');
})

closeTog.addEventListener('click', () => {
    menu.classList.remove('active')
})

// console.log(postForm)

postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let date = new Date();

    let title = postTitle.value;
    let postDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    let summary = postSummary.value;
    let content = postContent.value;
    let video = videoLink.value;
    let image = imageLink.value;

    db.collection("posts").add({
        title,
        postDate,
        summary,
        content,
        video,
        image
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert('success')
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
})


// db.collection("users").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         // console.log(JSON.stringify(doc.data()));
//         console.log(`${doc.id} => ${doc.data().last}`);
//     });
// });
