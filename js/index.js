var encendido = false;
var estricto = false;
var botonesMusicales = new Array(4);
var secuenciaBotones = [];
var puntos=0;
var esJugador=false;
var botonApretado=false;
var contadorBotonesApretados=0;
var audioActual;

$(document).ready(function(){
  cargarBotonesMusicales();
  $("#puntos").val("- -");
  $("#switch").on("click", switchOnOff);
  $(".clickeable").on("mousedown",eventoApretarBoton);
  $(".botonMusical").removeClass("clickeable");
  $(document).on("mouseup",eventoSoltarBoton);
});

function chequearBotonApretado(){
  contadorBotonesApretados++;
  var nombreBoton = $(botonApretado).attr("id");
  var numeroBoton = getNumeroBotonPorNombre(nombreBoton);
  if (numeroBoton != secuenciaBotones[contadorBotonesApretados-1]){
    audioActual.pause();
        audioActual = new Audio("http://www.astrosurf.com/luxorion/Documents/electricshock.wav");
    audioActual.play();
    contadorBotonesApretados = 0;
    setNoEsJugador();
    setTimeout(eventoSoltarBoton,100);
    var tiempo = simularCargarPuntos("! !");
    if (estricto){
      setTimeout(setearJuego,tiempo);
    }else{
      setTimeout(turnoMaquina,tiempo);
    }
  }else if (contadorBotonesApretados == puntos){
    if (puntos == 20){
      setJuegoGanado();
    } else{
      contadorBotonesApretados = 0;
      setNoEsJugador();
      agregarNuevaSecuencia();
      setTimeout(eventoSoltarBoton,500);
      setTimeout(turnoMaquina,700);    
    }

  }
}
function setJuegoGanado(){
  var intervalo = setInterval(function(){ 
    if (contadorBotonesApretados!=0){
          $("#puntos").val("* *"); 
    }
    setTimeout(function(){ 
      if (contadorBotonesApretados==0){
        clearInterval(intervalo);
      } else{
        $("#puntos").val(""); 
      }
    }, 200);
  }, 400);
  setNoEsJugador();
  var idBoton = "#"+$(botonApretado).attr("id");
  eventoSoltarBoton();
  var t=0;
  for (var i=1; i<8; i++){
    t+=100;
    setTimeout(function(){eventoApretarBoton(idBoton);},t);
    t+=100;
    setTimeout(eventoSoltarBoton,t);
  }
}

function getNumeroBotonPorNombre(nombre){
  for (var i=0; i<botonesMusicales.length; i++){
    if (botonesMusicales[i][0] == nombre){
      return i;
    }
  }
}

function eventoApretarBoton(){
  if (encendido){
    if (esJugador){
      botonApretado = this;
      audioActual = getAudioBoton(this);
      audioActual.play();
      chequearBotonApretado();
      setearLuz(this,20);
    }else{
        if (typeof arguments[0] == "string"){
          botonApretado = arguments[0];
          setearLuz(arguments[0],20);
          getAudioBoton(arguments[0]).play();
        }
         
    }

  }
}
function eventoSoltarBoton(){
  if (encendido && botonApretado){
      setearLuz(botonApretado,-20);
      botonApretado = false;
  }
}
function setearJuego(){
  if (encendido){
    limpiarJuego();
    var tiempoCarga = simularCargarPuntos("- -");
    setTimeout(agregarNuevaSecuencia,tiempoCarga);
    setTimeout(turnoMaquina,tiempoCarga);
  }
}

function limpiarJuego(){
  secuenciaBotones = [];
  puntos=0;
  setNoEsJugador();
  botonApretado=false;
  contadorBotonesApretados=0;
}
function turnoJugador(){
  esJugador = cambiarEstado(esJugador);
  $(".botonMusical").addClass("clickeable");
}


function agregarNuevaSecuencia(){
  secuenciaBotones.push(Math.floor(Math.random()*4));
  puntos++;
  mostrarPuntos();
}
function turnoMaquina(){
  var t=0;
  //agregarNuevaSecuencia();
  for (var i=0; i<secuenciaBotones.length; i++){  
    t+=200;
    apretarBoton(t,i);
    t+=400;
    soltarBoton(t);
  }
  setTimeout(turnoJugador,t); 
  
  function apretarBoton(tiempo,numeroSecuencia){
    setTimeout(function(){
      var numeroBoton = secuenciaBotones[numeroSecuencia];
      var nombreBoton = botonesMusicales[numeroBoton][0];
      eventoApretarBoton("#"+nombreBoton);
    },tiempo);
  }
  function soltarBoton(tiempo){
    setTimeout(function(){
      eventoSoltarBoton();
    },tiempo);
  }
}

function setNoEsJugador(){
  esJugador=false;
  $(".botonMusical").removeClass("clickeable");
}
function simularCargarPuntos(salida){
  var tiempo = cargando();
  setTimeout(function(){
    mostrarPuntos();
  },tiempo*2);
  return tiempo*2;
  
  function cargando(){
    var t=0;
    for (var i=1; i<3; i++){
      setTimeout(function(){
        $("#puntos").val("");
      },t);
      t+=300;
      setTimeout(function(){
        $("#puntos").val(salida);
      },t);   
      t+=300;
    }
    return t;
  }
}
function mostrarPuntos(){
  var mostrar = puntos;
  if (puntos < 10){
    mostrar = "0" + puntos;
  }
  $("#puntos").val(mostrar);
}
function getAudioBoton(elemento){
  var nombreBoton = $(elemento).attr("id");
  for (var j=0; j<botonesMusicales.length; j++){
    if (botonesMusicales[j][0] == nombreBoton){ 
      return new Audio(botonesMusicales[j][1]);  
    }
  }
}
function cargarBotonesMusicales(){
  botonesMusicales[0]=["boton-verde","https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"];
  botonesMusicales[1]=["boton-rojo","https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"];
  botonesMusicales[2]=["boton-amarillo","https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"];
  botonesMusicales[3]=["boton-azul","https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"];
}

function setearLuz(elemento,luz){
  var color = $(elemento).css("background-color");
  color = color.replace(/[^0-9,]+/g, "");
  var rojo = color.split(",")[0];
  var verde = color.split(",")[1];
  var azul = color.split(",")[2];
  hsl = rgbToHsl(rojo, verde, azul);
  //console.log(hsl[0]);
  $(elemento).css("background-color","hsl("+hsl[0]+","+hsl[1]+"%,"+(hsl[2]+luz)+"%)");
}

function switchOnOff(){
  //Cambio color de botones switch
  if ($(".sw-der").css("background-color")=="rgb(0, 0, 0)"){
    $(".sw-izq").css("background-color","rgb(0,0,0)");
    $(".sw-der").css("background-color","hsl(240, 100%, 60%)");
  }else{
    $(".sw-der").css("background-color","rgb(0,0,0)");
    $(".sw-izq").css("background-color","hsl(240, 100%, 60%)");
  }
  
  //limpio juego y cambio color de pantalla puntos.
  if (encendido){
    limpiarJuego();
 $("#puntos").addClass("puntosApagado").removeClass("puntosEncendido");
    $("#puntos").val("- -");
    if (estricto){cambiarEstadoEstricto();}
  }else{
    $("#puntos").addClass("puntosEncendido").removeClass("puntosApagado");
  }
  encendido = cambiarEstado(encendido);
}

function cambiarEstado(estado){
  return (estado == false)? estado=true : estado=false; 
}

function cambiarEstadoEstricto(){
  if (encendido){
    estricto = cambiarEstado(estricto);
    if (estricto){
      $("#btnEstrictoEstado")
        .addClass("estrictoEncendido")
        .removeClass("estrictoApagado");   
    }else{    
      $("#btnEstrictoEstado")
        .addClass("estrictoApagado")
        .removeClass("estrictoEncendido");  
    }
  }
}

//funcion obtenida de usuario Pointy en stackoverflow
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}