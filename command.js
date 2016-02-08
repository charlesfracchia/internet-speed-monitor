require('shelljs/global');

var internetDown = {
  "italian" : {
    "voice" : "Alice",
    "message" : "Attenzione! Attenzione! La connessione internet è caduta!"
  },
  "spanish" : {
    "voice" : "Monica",
    "message" : "¡Atención! ¡Atención! Se perdió la conexión a internet"
  },
  "english" : {
    "voice" : "Samantha",
    "message" : "Attention! Attention! Internet connection is down"
  },
  "chinese" : {
    "voice" : "Ting-Ting",
    "message" : "注意! 注意! 网络连接断开"
  },
  "french" : {
    "voice" : "Thomas",
    "message" : "Attention! Attention! La connection internet est tombée"
  },
  "greek" : {
    "voice" : "Melina",
    "message" : "προσοχή! προσοχή! Η σύνδεση με το διαδίκτυο έχει χαθεί"
  },
  "portuguese" : {
    "voice" : "Luciana",
    "message" : "atenção! atenção! conexão de internet é baixo"
  }
}

var internetMessage = {
  "italian" : {
    "voice" : "Alice",
    "message" : "La connessione internet è di XXX megabits per secondo"
  },
  "spanish" : {
    "voice" : "Monica",
    "message" : "La conexión a internet es de XXX megabits por segundo"
  },
  "english" : {
    "voice" : "Samantha",
    "message" : "The internet bandwidth is XXX megabits per second"
  },
  "chinese" : {
    "voice" : "Ting-Ting",
    "message" : "注意! 注意! 网络连接断开"
  },
  "french" : {
    "voice" : "Thomas",
    "message" : "Attention! Attention! La connection internet est tombée"
  },
  "greek" : {
    "voice" : "Melina",
    "message" : "προσοχή! προσοχή! Η σύνδεση με το διαδίκτυο έχει χαθεί"
  },
  "portuguese" : {
    "voice" : "Luciana",
    "message" : "atenção! atenção! conexão de internet é baixo"
  }
}

function say (voice,message) {
  console.log(voice);
  console.log(message);
  var speed = 175;
  var sayCommand = 'say -r' + speed + ' -v'+ voice + ' ' + message;
  var say = exec(sayCommand, {silent:true}).output;
  return say;
}

function checkInternet () {
  var internet = exec("speedtest-cli --simple", {silent:true}).output;
  var internet = internet.trim().split("\n");
  var ping = parseInt(internet[0].replace("Ping: ","").replace(" ms",""));
  var download = parseInt(internet[1].replace("Download: ","").replace(" Mbit/s",""));
  var upload = parseInt(internet[2].replace("Upload: ","").replace(" Mbit/s",""));
  internet = {
    "ping" : ping,
    "download" : download,
    "upload" : upload
  }
  return internet;
}
var download = 25;
var meow = {"italian":null,"spanish":null,"english":null}
for (m in meow){
  console.log(m);
  var msg = internetMessage[m].message.replace("XXX",download);
  var m = say(internetMessage[m].voice,msg);
  console.log(m);
}


// var m = checkInternet();
// console.log(m);

// if (m.download < 25) {
//   for (lang in internetDown) {
//   // if (lang == "heather"){
//     var m = say(internetDown[lang].voice,internetDown[lang].message);
//     console.log(m);
//   // }
//   }
// }

