  // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyBcH_7MwAjZAbg7I0neKRdI76iLbPPE8GU",
        authDomain: "blog-59f10.firebaseapp.com",
        projectId: "blog-59f10",
        storageBucket: "blog-59f10.appspot.com",
        messagingSenderId: "597103351614",
        appId: "1:597103351614:web:895fa35187f7c07fad3e6f",
        measurementId: "G-DZS4K4DLG4"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    // Google sign in

    function googleSignIn(){
      let provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        //   /** @type {firebase.auth.OAuthCredential} */
          let credential = result.credential;
    
          // This gives you a Google Access Token. You can use it to access the Google API.
          let token = credential.accessToken;
          // The signed-in user info.
          let user = result.user;
          console.log(user)
          // ...
      }).catch((error) => {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorMessage)
          // The email of the user's account used.
          let email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential;
          // ...
      });
  }

  // Sign out user

  function signOut(){
      firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log('Signed out')
      // window.location.href = 'index.html';
      }).catch((error) => {
      // An error happened.
      console.log(error)
      });
  }

  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
     
          console.log(user.displayName)
          document.querySelector('.sign-in').style.display = 'none'
          document.querySelector('.sign-out').style.display = 'block'
          // ...
      } else {
          // User is signed out
          // ...
         
          document.querySelector('.sign-in').style.display = 'block'
          document.querySelector('.sign-out').style.display = 'none'
      }
  });
  