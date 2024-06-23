
// Select The Elements
var toggle_btn;
var big_wrapper;
var hamburger_menu;

function declare() {
  toggle_btn = document.querySelector(".toggle-btn");
  big_wrapper = document.querySelector(".big-wrapper");
  hamburger_menu = document.querySelector(".hamburger-menu");
}

const main = document.querySelector("main");

declare();

let dark = false;

function toggleAnimation() {
  // Clone the wrapper
  dark = !dark;
  let clone = big_wrapper.cloneNode(true);
  if (dark) {
    clone.classList.remove("light");
    clone.classList.add("dark");
  } else {
    clone.classList.remove("dark");
    clone.classList.add("light");
  }
  clone.classList.add("copy");
  main.appendChild(clone);

  document.body.classList.add("stop-scrolling");

  clone.addEventListener("animationend", () => {
    document.body.classList.remove("stop-scrolling");
    big_wrapper.remove();
    clone.classList.remove("copy");
    // Reset Variables
    declare();
    events();
  });
}

function events() {
  toggle_btn.addEventListener("click", toggleAnimation);
  hamburger_menu.addEventListener("click", () => {
    big_wrapper.classList.toggle("active");
  });
}

events();



//Maps



let map;

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker",);
  const map = new Map(document.getElementById("map"), {
    center: { lat: 56, lng: 371.644 },
    zoom: 8,
    mapId: "d0df2efdca5d1b96",
  });

  let gårdbutikker = [];
  const pins = [];

  fetch('https://xn--movegrdbutikapi-llb.azurewebsites.net/api/Gårdbutik')
  .then(res => res.json())
  .then(data => {
  gårdbutikker = data;
  

  gårdbutikker.forEach((gårdbutik, i) => {
    pins.push({
      position: { lat: gårdbutik.lat, lng: gårdbutik.lng },
      title: gårdbutik.name,
      address: gårdbutik.address,
      contentString2: "<h2>" + gårdbutik.name + "</h2><br>" + "<div style='width: 300px'>" + gårdbutik.description + "</div>" + "<div><br><b>åbningstider:</b> <br> Mandag: <p style='display: inline-block; margin-left: 30px;'>8-18</p><br> Tirsdag: <p style='display: inline-block; margin-left: 33.5px;'>8-18</p><br> Onsdag: <p style='display: inline-block; margin-left: 33.5px;'>8-18</p><br> Torsdag: <p style='display: inline-block; margin-left: 30.5px;'>8-18</p><br> Fredag: <p style='display: inline-block; margin-left: 37.5px;'>8-18</p><br> Lørdag: <p style='display: inline-block; margin-left: 37.5px;'>8-18</p><br> Søndag: <p style='display: inline-block; margin-left: 34px;'>8-18</p></div><br>" + "<i>" + gårdbutik.address + "</i>" + "<br><br><a href='butiksside.html'><button class=btn style='margin-left: 50px'>Besøg</button></a>",
    })
  })
  


  

  const infoWindow = new InfoWindow();

  console.log(pins)

  pins.forEach(({ position, title, contentString2 }, i) => {
    const pin = new PinElement({
      glyph: `${i + 1}`,
      scale: 1.3,
    });
    const marker2 = new AdvancedMarkerElement({
      position,
      map,
      title: `${i + 1}. ${title}`,
      content: pin.element,
    });
    
    marker2.addListener("click", ({ domEvent, latLng }) => {
      const { target } = domEvent;

      infoWindow.close();
      infoWindow.setContent(contentString2);
      infoWindow.open(marker2.map, marker2);
    });
  });

})
}

initMap();

//API
var Bruger;


const url = "https://xn--movegrdbutikapi-llb.azurewebsites.net/api/User"

Vue.createApp({
  data() {
      return {
          users: [],
          title1: null,
          addData: {Id: "", username: "", password: "", farm: ""},
          loggedInUser: null
      }
  },
  async created() {
      console.log("created")
      try {
          const response = await axios.get(url)
          const response2 = await axios.get(url + '/getcurrentuser')
          this.loggedInUser = response2.data
          this.users = response.data
          const buttonById = document.getElementById('loginbutton');
          console.log(this.loggedInUser)
          if(this.loggedInUser.username){
            buttonById.innerText = 'Log Out'
          }
          console.log('Button by ID:', buttonById);
      } catch (error) {
          this.users = error.users
      }
  },
  methods: {      
    async getAll() {
      try {
          console.log(url)
          const response = await axios.get(url)
          this.users = await response.data
          console.log(this.users)
      } catch (ex) {
          alert(ex.message)
      }
    },
    async addUser() {
      try {
        const numbers = this.users.map(user => user.id);
        const max = Math.max(...numbers)
        
        this.addData.Id = max + 1;
        

          response = await axios.post(url, this.addData)

          this.addData = { Id: "", username: "", password: "", farm: "" };
          
      } catch (ex) {
          alert(ex.message)
      }
    },
    async loginUser() {
      console.log(this.users)
      
      var userid = this.users.find(user => user.username === this.addData.username && user.password === this.addData.password) 


      Bruger = this.addData.username;
      console.log(userid)
      console.log(userid.id)
      console.log(Bruger)

      const userExists = this.users.some(user => user.username === this.addData.username && user.password === this.addData.password)

      if(userExists){
        await axios.get(url + "/getuser/" + userid.id)
        
        loggedInUser = this.addData.username;
        window.location.href = 'profil.html';
        
      }
      else{
        alert('no user')
      }
    },
    async ID(){

      const numbers = this.users.map(user => user.id);
      const max = Math.max(...numbers)
      alert(max)
    }
  }
}).mount("#app")




const url2 = "https://xn--movegrdbutikapi-llb.azurewebsites.net/api/Gårdbutik"

Vue.createApp({
  data() {
      return {
          Gårdbutik: [],
          title1: null,
          addData: {id: "", name: "", address: "", description: "", kartofler: false, lng: 0, lat: 0},
          
      }
  },
  async created() {
      console.log("created")
      try {
          const response = await axios.get(url2)
          this.Gårdbutik = response.data
      } catch (error) {
          this.Gårdbutik = error.Gårdbutik
      }
  },
  methods: {      
    async getAll() {
      try {
          console.log(url2)
          const response = await axios.get(url2)
          this.Gårdbutik = await response.data
          console.log(this.Gårdbutik)
      } catch (ex) {
          alert(ex.message)
      }
    },
    async addGårdbutik() {
      try {
        const numbers = this.Gårdbutik.map(butik => butik.id);
        const max = Math.max(...numbers)
        
        this.addData.id = max + 1;
        

          response = await axios.post(url2, this.addData)

          this.addData = { id: "", name: "", address: "", description: "", kartofler: "" , lng: 0, lat: 0};
          
      } catch (ex) {
          alert(ex.message)
      }
    },
    async ID(){

      const numbers = this.users.map(user => user.id);
      const max = Math.max(...numbers)
      alert(max)
    }
  }
}).mount("#app2")

