//muuttujat
var taustakuva;
var pilvikuva;
var lautta_y = 300;
var lautan_leveys = 100;
var painovoima = 0.05;
var pilvilista = [];
var elamat;
var pisteet;
var pilvitimer;

//lataa kuvat
function preload() {
  taustakuva = loadImage('images/tausta.png');
  pilvikuva = loadImage('images/pilvi.png');
}

//asettaa canvasin
function setup() {
  var canvas = createCanvas(windowWidth, windowWidth / 3 );
  canvas.parent('pilvipeli');
  noCursor()    //ei näytä kursoria
  angleMode(DEGREES);   //käytetään asteita
  textSize(32);
}

function aloitaPeli() {
  elamat = 10;
  pisteet = 0;
  pilvilista = [];
  clearTimeout(pilvitimer);
  loop();
  luo_pilvia();
}

//taustakuvan koko muuttuu näytön koon mukaan
function windowResized(){
  resizeCanvas(windowWidth, windowWidth / 3);
  image(taustakuva, 0, -30, windowWidth, windowWidth / 3 + 30);
}

//piirtää kuvat
function draw() {
  var pelin_korkeus = windowWidth / 3;
  image(taustakuva, 0, -30, windowWidth, pelin_korkeus + 30);    //piirtää taustakuvan
  lautta(pelin_korkeus);   //piirtää lautan
  //piirtää pilvet
  pilvilista.forEach(function(pilvi_olio, monesko){
    pilvi_olio.liikuta(pelin_korkeus);
    if(pilvi_olio.pilvi_y > pelin_korkeus) {
      elamat = elamat - 1;
    }
    if(pilvi_olio.pilvi_x > windowWidth){
      pivilista.splice(monesko, 1); 
      pisteet = pisteet + 1;
    }
  text("elämät: " + elamat + " pisteet: " + pisteet,
  10, 30);
 });
}

//luo lautta -functio
function lautta(pelin_korkeus){
  fill('#ffe6e6');
  rect(mouseX, pelin_korkeus - 50, lautan_leveys, 30, 20, 20, 0, 0);
}

//luo pilviä -funktio
function luo_pilvia(){
  var laukaise_pilvi = random(1000, 5000);
  pilvi_olio = new Pilvi();
  pilvilista.push(pilvi_olio);
  pilvitimer = setTimeout(luo_pilvia, laukaise_pilvi);
}

//Pilvi-luokka
class Pilvi {
  //lähettää pilven ylös ja painovoima tuo sen alas
  constructor() {
    this.pilvi_x = 0;
    this.pilvi_y = 100;
    this.pilven_korkeus = 50;
    this.pilven_leveys = 50;
    this.pilven_nopeusY = random(-2, -4);
    this.pilven_nopeusX = random(1, 5);
    this.kulma = 0;
  }

  //liikuta-metodi
  liikuta(pelin_korkeus){
    this.pilvi_x = this.pilvi_x + this.pilven_nopeusX;
    this.pilven_nopeusY = this.pilven_nopeusY + painovoima;
    this.pilvi_y = this.pilvi_y + this.pilven_nopeusY;
    this.kulma = this.kulma + 10;
    //lauttaan törmäys
    if(this.pilvi_y + this.pilven_korkeus / 2> pelin_korkeus - 50 ){
      if(this.pilvi_x > mouseX && this.pilvi_x < mouseX + lautan_leveys){
        //jos osui, lähetetään kissa ylös samalla nopeudella, kuin se tuli alas
        this.pilven_nopeusY = -abs(this.pilven_nopeusY)
      }
    }
    
  //piirtää pilven
  push();       // tallentaa koordinaatiston origon ja kulman
  translate(this.pilvi_x, this.pilvi_y); //siirtää koordinaatiston origon pilven kohdalle
  rotate(this.kulma);
  imageMode(CENTER);         //asetaa kuvan origon kuvan keskelle
  image(pilvikuva, 0 ,0 ,this.pilven_leveys, this.pilven_korkeus);
  pop();        // palauttaa koordinaatiston asetuksen alkuperäiseen
  }
}

