// Firebase configuration
var firebaseConfig = {
  apiKey: "",  // yor API_KEY goes here
  authDomain: "",// yor AUTH_DOMAIN goes here
  databaseURL: "",// yor DATABASE_URL goes here
  projectId: "",// yor PROJECT_ID goes here
  storageBucket: "",// yor STORAGE_BUCKET goes here
  messagingSenderId: "",// yor MESSAGING_SENDER_ID goes here
  appId: ""// yor APP_ID goes here
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();        
const colRef = db.collection("users");
const nameField=document.querySelector("#exampleInputUserName");
const emailField=document.querySelector("#exampleInputEmail1");
const subscribeCheckBox=document.querySelector("#exampleCheck1");
const submitButton=document.querySelector("#submitButton");
const alertMessage=document.querySelector("#alertMessage")
var recordsTable = document.getElementById("dbRecords");

function createDoc(user){
    console.log("Creating doc with reference...", user);
    // Write Data
    colRef.add({
        name: user.name,
        email: user.email,
        subscribe: user.subscribe
    })
    .then(function(docRef) {
        console.log("Document created with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });        
}

function getAllDocs(){
    // Read document
    colRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    });
}

function updateDoc(docId, user){
    //Updated document
    var docRef = colRef.doc(docId);

    docRef.update({
        "name": user.name,
        "email": user.email,
        "subscribe": user.subscribe
    })
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });        
}

function removeDoc(docId){
    docId = docId.trim();
    // Delete document
    colRef.doc(docId).delete().then(function() {
        displayAlert("Document successfully deleted! with ID"+ docId)

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

submitButton.addEventListener("click",function(){    
    const name = nameField.value;
    const email = emailField.value;
    const subscribe = subscribeCheckBox.value;
    // const user = {name: name, email: email, subscribe: subscribe};
    console.log("name: ", name, "email ", email, "subscribe ", subscribe);
    colRef.add({
        name: name,
        email: email,
        subscribe: subscribe
    })
    .then(function(documentRef) {
        displayAlert("Document created with ID: ", documentRef.id)
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    }); 
    getRealTimeUpdate(); 
});


function displayAlert(message){
    $("#dbAlert").addClass('show') 
    alertMessage.innerHTML = message;
}

function getRealTimeUpdate(){
    colRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            const user=doc.data();

            var row = recordsTable.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(3);

            cell1.innerHTML = doc.id;
            cell2.innerHTML = user.name;
            cell3.innerHTML = user.email;
            cell4.innerHTML = user.subscribe;
            cell4.innerHTML = `<button type="button" onclick="removeDoc('${doc.id}')" class="btn btn-danger">Delete</button>`;
        });
    });
}
getRealTimeUpdate();


 