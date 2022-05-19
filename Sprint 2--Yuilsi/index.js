const form = document.getElementById("form");
const csvFile = document.getElementById("csvFile");
const table = document.getElementById("showData");
const tableTitles = document.getElementById("titles");
const person1 = document.getElementById("person1");
const person2 = document.getElementById("person2");
const compareBtn = document.getElementById("compare");
const resultTxt = document.getElementById("result");
const reader=new FileReader();

let ascData = false;
let database;

//Cuando oprima "submit"
form.addEventListener("submit", function(e){
    e.preventDefault();
    console.log("File submit")
    read();
});


function read(){
    //Constante para insertar datos en un arreglo
    const data=csvFile.files[0];

    reader.onload = function(e){
        const text = e.target.result;
        //Escribe lo del excel en la constante text
        const info=csvToArray(text);
        database = info;
        fillTable(table, info);
        console.log(JSON.stringify(info));
        fillSelects(info);
    }
      //Leo datos
    reader.readAsText(data);
}

function fillSelects(info){
  for(var i = 0; i < info.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = info[i].Nombre;
    opt.value  = info[i].Nombre;
    person1.appendChild(opt);
    }

  for(var i = 0; i < info.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = info[i].Nombre;
    opt.value  = info[i].Nombre;
    person2.appendChild(opt);
    }
}


function csvToArray(str, delimiter = ";") {
    //Filas:
    const headers=str.slice(0, str.indexOf("\r\n")).split(delimiter);
    //Columnas:
    //+1 para skipear la primera fila (la de titulos)
    const rows=str.slice(str.indexOf("\n") + 1).split("\r\n");   
    
    const arr=rows.map(function(row){
        //Split
        const values=row.split(delimiter);
        //reduce le pone la etiqueta correspondiente a cada item
        const tag=headers.reduce(function(object,header,index){
            object[header] = values[index];
            return object;
        }, {});//cierra headers.reduce
            return tag;
    });//cierra rows.map
            return arr;
}//cierra csvToArray

function sortData(attr){
        if(ascData){
          database.sort(function(a, b){
            return a[attr] - b[attr];
          });
          table.innerHTML="";
          fillTable(table,database);
        }else if(!ascData){
          database.sort(function(a, b){
            return b[attr] - a[attr];
          });
          table.innerHTML="";
          fillTable(table,database);
        }
       console.log(database);
  }


//Este método se llama más arriba:
function fillTable(table, info) {
    for (let e of info) {
      let row = table.insertRow();
      for (k in e) {
        let cell = row.insertCell();
        let text = document.createTextNode(e[k]);
        cell.appendChild(text);
      }
    }
  }

  //Imprimir los datos organizados en la consola
  function sendTableToConsoleLog() {
    for (let e of info) {
      let row = table.insertRow();
      for (k in e) {
        let cell = row.insertCell();
        let text = document.createTextNode(e[k]);
        cell.appendChild(text);
      }
    }
  }

//Cuando oprima en los títulos
tableTitles.addEventListener("click",function (f) {
    let attr = f.target.id;
    console.log(attr);
    ascData = !ascData;
    sortData(attr);
});

compareBtn.addEventListener("click", function(){
  //elecciones de la lista desplegable
  let select1 = person1.options[person1.selectedIndex].text;
  let select2 = person1.options[person2.selectedIndex].text;
  let Obj1 = [];
  let Obj2 = [];

  for(var i = 0; i < database.length; i++) {
    if(select1===database[i].Nombre){
    Obj1 = database[i];
    }
  }

  for(var i = 0; i < database.length; i++) {
    if(select2===database[i].Nombre){
    Obj2 = database[i];
    }
  }

  let Arr1 = Object.values(Obj1);
  let Arr2 = Object.values(Obj2);
  let Arr1NoName = Arr1.splice(1);
  let Arr2NoName = Arr2.splice(1);
  let result = cos(Arr1NoName,Arr2NoName);

  if(result>=0.99){
    resultTxt.innerHTML = "La similitud de estas dos personas es: 1<br> Sopechoso...";
  }else{
    resultTxt.innerHTML = `La similitud de estas dos personas es: ${result}`;
  };
});

//Función llamada en línea 132
function cos(Arr1,Arr2){
  let d = dotProduct(Arr1,Arr2);
  let m1 = magnitude(Arr1);
  let m2 = magnitude(Arr2);
  let result = d/(m1*m2);
  return result;
}

//Función llamada en línea 143
function dotProduct(a,b){
  var sum = 0;
  for(var i=0; i< a.length; i++) {
    sum += a[i]*b[i];
  }
  return sum;
}

//Función llamada en línea 144
function magnitude(a){
  var sum = 0;
  for(var i=0; i< a.length; i++) {
    sum += Math.pow(a[i],2);
  }
  let result = Math.sqrt(sum);
  return result;
  }