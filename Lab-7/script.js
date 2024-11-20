function FetchTable(){
    const x = new XMLHttpRequest();
    x.open("GET", "data.xml", true);
    x.onload = function () {
        if(x.status === 200){
            let xml = x.responseXML;
            showTable(xml);
        }else{
            document.getElementById('mydiv').textContent = "Error loading file";
        }
    };
    x.onerror = function(){
        document.getElementById("mydiv").textContent = "Network Error";
    };
    x.send();
    function showTable(xml){
        let users = xml.getElementsByTagName("user");
        let table = "<table border='1'><tr><th>Name</th><th>age</th><th>city</th></tr>";

        for(let i=0; i< users.length; i++){
            let name = users[i].getElementsByTagName("name")[0].textContent;
            let age = users[i].getElementsByTagName("age")[0].textContent;
            let city = users[i].getElementsByTagName("city")[0].textContent;
            table += `<tr><td>${name}</td><td>${age}</td><td>${city}</td></tr>`;
        }
        table += "</table>";
        document.getElementById("mydiv").innerHTML = table
    }
}