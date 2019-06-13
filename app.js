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

const submitButton=document.querySelector("#submitButton");
const emailField=document.querySelector("#exampleInputEmail1");
const passwordField=document.querySelector("#exampleInputPassword1");
const checkBoxField=document.querySelector("#exampleCheck1");
var recordsTable = document.getElementById("dbRecords");
const messages = document.getElementById("messages");

function createDoc(user){
    // Add a new document in collection "cities"
    db.collection("users").add({
        email: user.email,
        password: user.password,
        checked: user.checked
    })
    .then(function(docRef) {
        sendMessage("Document \""+docRef.id+"\" successfully written!", "success")
    })
    .catch(function(error) {
        sendMessage(error.message, "danger")        
    });
}

submitButton.addEventListener("click",function(event){
    event.preventDefault();
    event.stopPropagation();
    const emailValue = emailField.value;
    const passwordVale = passwordField.value;
    const checkedValue = checkBoxField.value;
    var user={email: emailValue, password: passwordVale, checked: checkedValue}
    createDoc(user);
    getRealTimeUpdate();
});

function resetUserForm(){
    emailField.value = '';
    passwordField.value = '';
}

function getRealTimeUpdate(){
    resetUserForm();

    db.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            const user=doc.data();

            var row = recordsTable.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);

            cell1.innerHTML = doc.id;
            cell2.innerHTML = user.email;
            cell3.innerHTML = user.password;
            cell4.innerHTML = user.checked;
            cell5.innerHTML = `<button type="button" onclick="removeDoc('${doc.id}')" class="btn btn-danger">Delete</button>`;
        });
    });
}
getRealTimeUpdate();

function removeDoc(docId){
    docId = docId.trim();
    // Delete document
    db.collection("users").doc(docId).delete().then(function() {
        sendMessage("Document \""+docId+"\" successfully deleted!", "success");        

    }).catch(function(error) {
        sendMessage(error.message, "danger");
    });
}

function sendMessage(message, alertClass){
    var alert_message = `<div class="alert alert-${alertClass} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>`
    messages.innerHTML = alert_message;
}
    