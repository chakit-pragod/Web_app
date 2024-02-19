const RB = ReactBootstrap;


// function EditButton({ std, app }) {
//     return <button onClick={() => app.edit(std)}>แก้ไข</button>
// }

// function DeleteButton({ std, app }) {
//     return <button onClick={() => app.delete(std)}>ลบ</button>
// }

function StudentTable({ data, app }) {
    var rows = [];
    for (var s of data) {
        rows.push(<tr>
            <td>{s.id}</td>
            <td>{s.title}</td>
            <td>{s.fname}</td>
            <td>{s.lname}</td>
            <td>{s.email}</td>
            {/* <td>EditButton std={s} app={app}</td>
            <td>DeleteButton std={s} app={app}</td> */}
        </tr>);
    }
    return <table className='table'>
        <tr>
            <td>รหัส</td>
            <td>คำนำหน้า</td>
            <td>ชื่อ</td>
            <td>สกุล</td>
            <td>email</td>
        </tr>
        {rows}
    </table>
}

function TextInput({ label, app, value }) {
    return <label className="form-label">
        {label}:
        <input className="form-control"
            value={app.state[value]} onChange={(ev) => {
                var s = {};
                s[value] = ev.target.value;
                app.setState(s)
            }
            }></input>
    </label>;
}

const firebaseConfig = {
    apiKey: "AIzaSyDNMliUdJxEZSjIVqbLB0vF6hvFkU2JSKs",
    authDomain: "web2566-55649.firebaseapp.com",
    projectId: "web2566-55649",
    storageBucket: "web2566-55649.appspot.com",
    messagingSenderId: "500471255191",
    appId: "1:500471255191:web:54c6c60a88b38fea9559d2",
    measurementId: "G-53EKEQV41E"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.collection("students").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
    });
});


class App extends React.Component {

    // config header 
    title = (
        <RB.Alert variant="info">
            <b>Work6 :</b> Firebase
        </RB.Alert>
    );

    // config footer
    footer = (
        <div>
            By 643021316-6 chakit pragod <br />
            College of Computing, Khon Kaen University
        </div>
    );


    readData() {
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            console.log(stdlist);
            this.setState({ students: stdlist });
        });
    }

    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    state = {
        scene: 0,
        students: [],
        stdid: "",
        stdfname: "",
        stdlname: "",
        stdemail: "",
        stdphone: "",
    }

    insertData() {
        db.collection("students").doc(this.state.stdid).set({
            title: this.state.stdtitle,
            fname: this.state.stdfname,
            lname: this.state.stdlname,
            phone: this.state.stdphone,
            email: this.state.stdemail,
        });
    }

    edit(std) {
        this.setState({
            stdid: std.id,
            stdtitle: std.title,
            stdfname: std.fname,
            stdlname: std.lname,
            stdemail: std.email,
            stdphone: std.phone,
        })
    }

    delete(std) {
        if (confirm("ต้องการลบข้อมูล")) {
            db.collection("students").doc(std.id).delete();
        }
    }

    render() {
        var stext = JSON.stringify(this.state.students);
        return (
            <RB.Card>
                <RB.Card.Header>{this.title}</RB.Card.Header>
                <RB.Card.Body>
                    <RB.Button onClick={() => this.autoRead()}>Auto Read</RB.Button>
                    <RB.Button onClick={() => this.readData()}>Read Data</RB.Button>
                    <div>
                        {stext}
                    </div>
                </RB.Card.Body>
                <RB.Card.Footer>
                    <b>เพิ่มนักศึกษา :</b><br />
                    <TextInput label="ID" app={this} value="stdid" />
                    <TextInput label="ชื่อ" app={this} value="stdfname" />
                    <TextInput label="สกุล" app={this} value="stdlname" />
                    <TextInput label="Email" app={this} value="stdemail" />
                    <TextInput label="Phone" app={this} value="stdphone" />
                    <RB.Button onClick={() => this.insertData()}>เพิ่มข้อมูล</RB.Button>
                    {this.footer}
                </RB.Card.Footer>
            </RB.Card>
        );
    }
}





const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);