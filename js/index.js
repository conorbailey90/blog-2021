let db = firebase.firestore()
const blogList = document.querySelector('.blog-list');
const menuTog = document.querySelector('.menu-tog');
const closeTog = document.querySelector('.close-tog');
const menu = document.querySelector('.menu');

let blogPosts;

menuTog.addEventListener('click', () => {
    menu.classList.add('active');
})

closeTog.addEventListener('click', () => {
    menu.classList.remove('active')
})

db.collection("posts").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // console.log(doc)
        let data = doc.data()
        // console.log(data)
        let li = document.createElement('li');
        li.classList.add('blog-post-row');

        let containerOne = document.createElement('div');
        containerOne.classList.add('row-container-one');

        let containerTwo = document.createElement('div');
        containerTwo.classList.add('row-container-two');

        let titleDiv = document.createElement('div');
        titleDiv.classList.add('post-title');
        titleDiv.innerText = `${data.title}`;

        let dateDiv = document.createElement('div');
        dateDiv.classList.add('post-date');
        dateDiv.innerText = `${data.postDate}`;


        let imageDiv = document.createElement('div');
        imageDiv.classList.add('post-image');

        let imageDivInner = document.createElement('div');
        imageDivInner.classList.add('post-image-inner');
        imageDivInner.style.backgroundImage = `url(${data.image})`
        imageDiv.appendChild(imageDivInner);

        let postLink = document.createElement('div');
        postLink.classList.add('post-link');
        postLink.innerText = `Open article`
        postLink.addEventListener('click', ()=>{
            window.location.href = `post.html?id=${doc.id}`;
        })

        containerOne.append(titleDiv, dateDiv);
        containerTwo.append(imageDiv, postLink)
        li.append(containerOne, containerTwo);
        
        blogList.appendChild(li)
    });
}).then(() => {
    blogPosts = [...document.querySelectorAll('.blog-post-row')];
    console.log(blogPosts)
    blogPosts.forEach((post, idx) => {
        post.addEventListener('click', () => {
            post.classList.toggle('active');
            for(let i = 0; i < blogPosts.length; i++){
                if (i !== idx){
                    blogPosts[i].classList.remove('active');
                }
            }
        })
       
    })
});

