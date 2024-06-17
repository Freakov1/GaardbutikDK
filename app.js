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
  const stop = [
    { 
      position: { lat: 56.678643, lng: 11.948066 },
      title: "gårdbutik",
      address: "gårdvej 819",
      contentString2: "<h1>aaa</h1>"
    },
    { 
      position: { lat: 55.678643, lng: 11.948066 },
      title: "gårdbutik2",
      address: "gardveaj",
      contentString2: "<h3>Gårdbutik</h3>" + "<div>åbningstider: <br> 10-16</div>"
    },
  ];
  const infoWindow = new InfoWindow();

  stop.forEach(({ position, title, contentString2 }, i) => {
    const pin = new PinElement({
      glyph: `${i + 1}`,
      scale: 1.5,
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

  const marker = new AdvancedMarkerElement({
    map,
    position: { lat: 54.678643, lng: 11.948066 },
  });
  new google.maps.Marker({
    position: { lat: 55, lng: 372 },
    map: map,
    animation: google.maps.Animation.DROP,
    icon: "/img/output-onlinepngtools.png",
  })

}

initMap();

//API

const url = "https://xn--movegrdbutikapi-llb.azurewebsites.net/api/User"

Vue.createApp({
  data() {
      return {
          users: [],
          title1: null,
          addData: {Id: "", username: "", password: ""},
          loggedInUser: null
      }
  },
  async created() {
      console.log("created")
      try {
          const response = await axios.get(url)
          this.users = response.data
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

          this.addData = { Id: "", username: "", password: "" };
          
      } catch (ex) {
          alert(ex.message)
      }
    },
    async loginUser() {
      console.log(this.addData.username)
      const userExists = this.users.some(user => user.username === this.addData.username && user.password === this.addData.password)

      if(userExists){
        loggedInUser = this.addData.username;
        window.location.href = 'profil.html';
        alert(loggedInUser);
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



